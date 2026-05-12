# Implementation Plan

Building all 5 features in the order listed. Email sending will use Lovable's built-in email infrastructure on a delegated subdomain (e.g. `notify.yourdomain.com`), which coexists cleanly with your Google Workspace mail on the root domain and your Cloudflare DNS. You only add a couple of NS records, nothing else changes about your existing email.

---

## 1. Email notifications (milestones + approvals)

**Triggers**
- Admin creates/updates a milestone → email the client
- Admin completes a milestone → email the client
- Admin requests an approval → email the client
- Client decides an approval (approved / changes requested) → email the admin
- Client posts an approval comment → email the admin
- Admin posts an approval comment → email the client

**Setup**
- Configure a sender subdomain (e.g. `notify.yourdomain.com`) via the email setup dialog. You will add 2 NS records in Cloudflare, then it verifies automatically.
- Set up email infrastructure (queue, suppression, send log) and scaffold the transactional email function.

**Templates** (React Email, brand-styled, white background)
- `milestone-update` (created / updated / completed variants via templateData)
- `approval-requested`
- `approval-decided` (admin-facing)
- `approval-comment` (both directions)

**Wiring**
- In `Admin.tsx` milestone create/update mutations: after success, invoke `send-transactional-email` with the client's email.
- In `ProjectApprovals.tsx` client decide mutation: notify admin(s).
- In approval comment insert: notify the other party.
- All sends use idempotency keys derived from milestone/approval IDs + event type.

---

## 2. Stripe checkout + webhooks (BYOK)

**Goal**: charge clients monthly for hosting and domain from the portal Billing tab.

**Database**
- `subscription_plans` (admin-managed): name, type (`hosting` | `domain` | `bundle`), amount_cents, currency, interval, stripe_price_id
- `client_subscriptions`: client_id, plan_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, cancel_at
- `stripe_events` (webhook idempotency): event_id PK, processed_at

**Edge functions**
- `stripe-create-checkout` (auth required, JWT verified): creates a Checkout Session in `subscription` mode for a given plan, returns the URL.
- `stripe-customer-portal` (auth required): returns a Stripe Billing Portal session URL so clients can update card / cancel.
- `stripe-webhook` (public, no JWT): verifies signature with `STRIPE_WEBHOOK_SECRET`, handles `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.paid`, `invoice.payment_failed`. Upserts `client_subscriptions`, mirrors paid invoices into existing `client_invoices`, and triggers a payment-receipt transactional email.

**Secrets needed**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (added after function deploy so you can paste the function URL into Stripe).

**Portal UI (Billing tab)**
- Client view: list of available plans with "Subscribe" buttons, active subscription card with status / next billing date / "Manage billing" button (opens Stripe portal).
- Admin view (in `Admin.tsx`): manage `subscription_plans` (CRUD), see each client's active subscription.

---

## 3. Referral emails

**Database**
- `client_referrals`: referrer_id (auth.users.id), referred_email, referred_name, message, status (`sent` | `signed_up` | `converted`), created_at

**UI**: new "Refer a client" card in Portal Overview with a small dialog (name, email, optional message).

**Action**: insert referral row, then invoke `send-transactional-email` with template `referral-invitation` (subject: "{referrer name} invited you to {brand}", body includes optional personal message and a CTA link to the marketing site / signup).

RLS: clients can read/insert their own referrals; admins can read all.

---

## 4. Support contact form (with screenshot uploads)

**Database**
- `support_tickets`: user_id (nullable for guests), name, email, subject, message, status (`new` | `in_progress` | `resolved`), created_at
- `support_ticket_attachments`: ticket_id, file_path, mime_type, size_bytes

**Storage**: new `support-attachments` bucket (private). RLS allows ticket owner and admins to read; anyone authenticated can upload to their own folder; guests upload via signed flow (we'll require auth for now to keep it simple, with a public fallback path under `guest/{ticket_id}/`).

**UI**
- New `/support` page with a contact form: name, email, subject, message, drag-and-drop image uploader (PNG/JPEG/WEBP, max 5 files, 10MB each, preview thumbnails).
- Add a "Support" link in portal nav and a footer link.
- Admin view: new "Support" tab in `/admin` listing tickets with status controls and inline attachment previews.

**On submit**: insert ticket, upload attachments, invoke transactional email to admin (`support-ticket-new`) and confirmation to user (`support-ticket-received`).

---

## 5. Build content uploads (PDFs, SVG, JPEG, PNG, etc.)

**Goal**: clients and admins can upload reference content for the website build, stored against the client's project.

**Database**
- `client_build_assets`: client_id, uploader_id, file_path, original_filename, mime_type, size_bytes, label, description, category (`logo` | `imagery` | `copy` | `brand` | `reference` | `other`), created_at

**Storage**: new `build-assets` bucket (private). RLS: client can read/upload/delete their own files (path prefix `{client_id}/`); admins can do all.

**Allowed types**: PDF, SVG, JPEG, PNG, WEBP, GIF, MP4, DOC/DOCX, ZIP. Max 50MB per file.

**UI**
- New "Build content" tab in Portal (between Workspace and Billing) with category filters, grid of uploaded files (thumbnail for images, icon for others), upload zone, label/category form per upload, delete control.
- Same panel embedded in admin client workspace dialog for admin-side uploads.

---

## Technical notes

- All new tables get RLS following the existing pattern (`auth.uid() = client_id` for owner access, `has_role(auth.uid(), 'admin')` for admin access).
- All transactional emails go through the single `send-transactional-email` function with one template per event; one recipient per send (no batching).
- Stripe webhook is the only public edge function; `verify_jwt = false` set in `supabase/config.toml` for it only.
- Brand: white email body, brand accents from the existing site palette, no em dashes.
- No new heavy deps: Stripe via `npm:stripe@17`, React Email already used.

---

## Order of execution

1. Email infrastructure setup (subdomain + scaffold) → milestone/approval templates + wiring.
2. Stripe DB + edge functions + plan management UI + portal billing UI.
3. Referrals table + UI + email.
4. Support DB + bucket + page + admin tab + emails.
5. Build assets DB + bucket + portal tab + admin panel.

After each phase, the related feature is fully usable on its own, so you can test incrementally.

---

## What I need from you to start phase 1

The exact subdomain you want for email sending (default suggestion: `notify.yourdomain.com`). After you confirm, I'll open the email setup dialog so you can enter your domain and get the 2 NS records to paste into Cloudflare.

Approve this plan and tell me the subdomain (or just say "use notify"), and I'll start building.