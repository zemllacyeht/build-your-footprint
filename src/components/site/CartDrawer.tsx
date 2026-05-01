import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, Minus, Plus, X, Loader2, Check, Trash2, Megaphone, Search, Camera, PenTool, Sparkles, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const ADDONS = [
  {
    id: "addon-marketing-collateral",
    name: "Marketing Collateral",
    price: "From $249/mo",
    desc: "Ongoing social, email, ads & print design.",
    icon: Megaphone,
  },
  {
    id: "addon-seo-boost",
    name: "SEO Boost",
    price: "From $349/mo",
    desc: "Keyword strategy, on-page SEO & monthly reporting.",
    icon: Search,
  },
  {
    id: "addon-content-photography",
    name: "Content & Photography",
    price: "From $499",
    desc: "Pro photo shoot or copywriting for your launch.",
    icon: Camera,
  },
  {
    id: "addon-brand-identity",
    name: "Brand Identity Kit",
    price: "From $799",
    desc: "Logo refresh, color system & brand guidelines.",
    icon: PenTool,
  },
];

const CARE_PLANS = [
  {
    id: "care-essential-care",
    name: "Essential Care",
    price: "$19/mo",
    desc: "Hosting, SSL, weekly backups & email support.",
  },
  {
    id: "care-growth-care",
    name: "Growth Care",
    price: "$59/mo",
    desc: "Daily backups, updates, content edits & priority support.",
    featured: true,
  },
  {
    id: "care-white-glove-care",
    name: "White-Glove Care",
    price: "Custom",
    desc: "Dedicated manager, custom SLA & same-day support.",
  },
];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const CartDrawer = () => {
  const { items, count, isOpen, closeCart, removeItem, updateQuantity, clear, addItem } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [carePromptOpen, setCarePromptOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", notes: "" });

  const hasCarePlan = items.some((i) => i.category === "Care plan");

  const submit = async () => {
    if (items.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    if (!hasCarePlan) {
      setCarePromptOpen(true);
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const requestId = crypto.randomUUID();
    const submittedAt = new Date().toLocaleString();
    const payloadItems = items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      category: i.category,
    }));

    try {
      // Owner notification
      const owner = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "cart-request-owner",
          idempotencyKey: `cart-owner-${requestId}`,
          templateData: {
            customerName: parsed.data.name,
            customerEmail: parsed.data.email,
            customerPhone: parsed.data.phone || "",
            customerCompany: parsed.data.company || "",
            notes: parsed.data.notes || "",
            items: payloadItems,
            submittedAt,
          },
        },
      });
      if (owner.error) throw owner.error;

      // Customer confirmation
      const cust = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "cart-request-customer",
          recipientEmail: parsed.data.email,
          idempotencyKey: `cart-customer-${requestId}`,
          templateData: {
            customerName: parsed.data.name,
            items: payloadItems,
          },
        },
      });
      if (cust.error) throw cust.error;

      setDone(true);
      clear();
      toast({ title: "Request sent", description: "We'll be in touch shortly." });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Couldn't send request",
        description: err?.message ?? "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Your selection {count > 0 && <span className="text-muted-foreground">({count})</span>}
            </SheetTitle>
            {items.length > 0 && !done && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </SheetHeader>

        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="h-12 w-12 rounded-full bg-primary/15 grid place-items-center mb-4">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-xl mb-2">Request received</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We'll reply within one business day with next steps.
            </p>
            <Button variant="glass" onClick={() => { setDone(false); closeCart(); }}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Your cart is empty. Add packages from the Pricing page.
                </p>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="glass rounded-lg p-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-accent mb-0.5">
                        {it.category}
                      </div>
                      <div className="font-medium text-sm truncate">{it.name}</div>
                      <div className="text-xs text-muted-foreground">{it.price}</div>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-border">
                        <button
                          aria-label="Decrease"
                          onClick={() => updateQuantity(it.id, it.quantity - 1)}
                          className="h-7 w-7 grid place-items-center hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs w-6 text-center">{it.quantity}</span>
                        <button
                          aria-label="Increase"
                          onClick={() => updateQuantity(it.id, it.quantity + 1)}
                          className="h-7 w-7 grid place-items-center hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      aria-label="Remove"
                      onClick={() => removeItem(it.id)}
                      className="h-7 w-7 grid place-items-center text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}

              {/* Required care plan picker */}
              {items.length > 0 && !hasCarePlan && (
                <div className="pt-4 mt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                      Choose a care plan · required
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Every project includes a care plan for hosting, security & ongoing support.
                  </p>
                  <div className="space-y-2">
                    {CARE_PLANS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          addItem({ id: p.id, name: p.name, price: p.price, category: "Care plan" })
                        }
                        className={`w-full text-left rounded-lg p-3 flex items-start gap-3 border transition glass hover:border-accent/40 ${
                          p.featured ? "border-accent/40" : "border-border"
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-md grid place-items-center shrink-0 ${
                            p.featured ? "bg-gradient-gold" : "bg-secondary"
                          }`}
                        >
                          <ShieldCheck
                            className={`h-3.5 w-3.5 ${
                              p.featured ? "text-accent-foreground" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-sm flex items-center gap-1.5">
                              {p.name}
                              {p.featured && (
                                <span className="text-[9px] uppercase tracking-wider text-accent">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground shrink-0">{p.price}</div>
                          </div>
                          <div className="text-xs text-muted-foreground leading-snug mt-0.5">
                            {p.desc}
                          </div>
                        </div>
                        <div className="h-5 w-5 rounded-full grid place-items-center shrink-0 mt-0.5 border border-border">
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional add-ons */}
              {items.length > 0 && (
                <div className="pt-4 mt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                      Optional add-ons
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Stack any of these with your selection — pricing confirmed by email.
                  </p>
                  <div className="space-y-2">
                    {ADDONS.map((a) => {
                      const selected = items.some((i) => i.id === a.id);
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() =>
                            selected
                              ? removeItem(a.id)
                              : addItem({ id: a.id, name: a.name, price: a.price, category: "Add-on" })
                          }
                          className={`w-full text-left rounded-lg p-3 flex items-start gap-3 border transition ${
                            selected
                              ? "border-accent/50 bg-accent/10"
                              : "border-border glass hover:border-accent/30"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-md grid place-items-center shrink-0 ${
                              selected ? "bg-gradient-gold" : "bg-secondary"
                            }`}
                          >
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                selected ? "text-accent-foreground" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-medium text-sm">{a.name}</div>
                              <div className="text-xs text-muted-foreground shrink-0">{a.price}</div>
                            </div>
                            <div className="text-xs text-muted-foreground leading-snug mt-0.5">
                              {a.desc}
                            </div>
                          </div>
                          <div
                            className={`h-5 w-5 rounded-full grid place-items-center shrink-0 mt-0.5 ${
                              selected
                                ? "bg-gradient-gold text-accent-foreground"
                                : "border border-border"
                            }`}
                          >
                            {selected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-muted-foreground" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Full name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  <Input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Anything we should know? (optional)"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                {!hasCarePlan && (
                  <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <div className="text-xs text-foreground/90 leading-relaxed">
                      <span className="font-medium">A care plan is required</span> to request a quote.
                      It keeps your site secure, hosted and supported after launch.
                    </div>
                  </div>
                )}
                <Button
                  variant="hero"
                  className="w-full"
                  disabled={submitting}
                  onClick={submit}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending request…
                    </>
                  ) : (
                    "Request quote"
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  No payment taken. We'll confirm pricing and next steps by email.
                </p>
              </div>
            )}
          </>
        )}
      </SheetContent>

      <AlertDialog open={carePromptOpen} onOpenChange={setCarePromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="h-10 w-10 rounded-full bg-accent/15 grid place-items-center mb-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
            <AlertDialogTitle className="font-display text-2xl">
              Choose a care plan to continue
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Every project includes one of our care plans. It covers hosting,
              security, monthly updates and ongoing support so your site stays
              fast, safe and looked after long after launch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCarePromptOpen(false);
                closeCart();
                setTimeout(() => {
                  const el = document.getElementById("pricing");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    window.location.href = "/pricing#pricing";
                  }
                }, 200);
              }}
            >
              View care plans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
};
