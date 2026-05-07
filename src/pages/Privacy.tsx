import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4 text-gradient-gold">{title}</h2>
    <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">{children}</div>
  </section>
);

const Privacy = () => {
  return (
    <PageLayout
      title="Privacy Policy | Build Your Footprint"
      description="How Build Your Footprint Media, LLC collects, uses, and protects your personal information."
    >
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use, and protect your personal information."
      />

      <article className="container max-w-3xl pb-24">
        <div className="text-xs uppercase tracking-[0.2em] text-accent mb-10">
          Last updated: May 6, 2026
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed text-[15px] mb-14">
          <p>
            This Privacy Policy describes how Build Your Footprint Media, LLC ("we," "us," or "our")
            collects, uses, and shares information about you when you visit
            www.buildyourfootprint.com, engage our services, or otherwise interact with us
            (collectively, the "Services").
          </p>
          <p>
            By using our Services, you agree to the practices described in this policy. If you do
            not agree, please do not use the Services.
          </p>
        </div>

        {/* Table of contents */}
        <nav aria-label="Table of contents" className="glass rounded-lg p-6 mb-14">
          <h2 className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Contents</h2>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            {[
              ["info-we-collect", "What information we collect"],
              ["how-we-process", "How we process your information"],
              ["sharing", "When we share your information"],
              ["cookies", "Cookies and tracking technologies"],
              ["retention", "How long we keep your information"],
              ["security", "How we keep your information safe"],
              ["us-rights", "Privacy rights for US residents"],
              ["contact", "How to contact us"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={`#${href}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14">
          <Section id="info-we-collect" title="1. What information we collect">
            <p>
              We collect personal information that you voluntarily provide when you contact us,
              request a proposal, sign up for an account, place an order, or otherwise interact
              with our Services. The categories of information we may collect include:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Names</li>
              <li>Email addresses</li>
              <li>Phone numbers</li>
              <li>Billing and mailing addresses</li>
              <li>Usernames and passwords</li>
              <li>Job titles and company information</li>
              <li>Project details you share with us</li>
            </ul>
            <p>
              <strong className="text-foreground">Payment information.</strong> When you make a
              purchase, payment details (card number, expiration, security code) are collected and
              processed directly by Stripe, our payment processor. We do not store full card
              numbers on our systems. See Stripe's privacy notice at{" "}
              <a href="https://stripe.com/privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                stripe.com/privacy
              </a>.
            </p>
            <p>
              <strong className="text-foreground">Automatically collected information.</strong> When
              you visit the Services we automatically collect technical data such as IP address,
              browser type, device characteristics, operating system, referring URLs, and pages
              viewed. This data is used for security, analytics, and reliability.
            </p>
          </Section>

          <Section id="how-we-process" title="2. How we process your information">
            <p>We process your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-foreground">Account management.</strong> Creating,
                maintaining, and securing your client account and project portal.
              </li>
              <li>
                <strong className="text-foreground">Service delivery.</strong> Designing, building,
                hosting, and supporting the websites and digital products you engage us to create.
              </li>
              <li>
                <strong className="text-foreground">Order fulfillment.</strong> Processing payments,
                issuing invoices and receipts, and delivering the goods or services you request.
              </li>
              <li>
                <strong className="text-foreground">Communications.</strong> Responding to
                inquiries, sending project updates, transactional notifications, and (where you
                have opted in) marketing emails about our work.
              </li>
              <li>
                <strong className="text-foreground">Security and fraud prevention.</strong>{" "}
                Protecting our Services, our clients, and ourselves from misuse and unauthorized
                access.
              </li>
              <li>
                <strong className="text-foreground">Legal compliance.</strong> Meeting our
                obligations under applicable law, regulations, or legal process.
              </li>
            </ul>
            <p>
              You can opt out of marketing communications at any time by clicking the unsubscribe
              link in our emails or contacting us directly.
            </p>
          </Section>

          <Section id="sharing" title="3. When we share your information">
            <p>We do not sell your personal information. We share information only in these limited situations:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-foreground">Business partners and service providers.</strong>{" "}
                Trusted vendors who help us operate the Services (such as hosting, email delivery,
                analytics, and Stripe for payments). These providers may access your information
                only to perform tasks on our behalf and are contractually required to protect it.
              </li>
              <li>
                <strong className="text-foreground">Business transfers.</strong> In connection with
                a merger, acquisition, financing, or sale of all or part of our assets, your
                information may be transferred as part of that transaction.
              </li>
              <li>
                <strong className="text-foreground">Legal requirements.</strong> Where required by
                law, subpoena, court order, or to protect our rights, property, or safety, or that
                of our clients or others.
              </li>
              <li>
                <strong className="text-foreground">With your consent.</strong> Any other sharing
                will only occur with your direction or consent.
              </li>
            </ul>
          </Section>

          <Section id="cookies" title="4. Cookies and tracking technologies">
            <p>
              We use cookies and similar tracking technologies (such as web beacons and local
              storage) to operate the Services, remember your preferences, analyze traffic, and
              improve performance. Cookies fall into a few categories:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-foreground">Essential.</strong> Required for the site to
                function (authentication, session management, security).
              </li>
              <li>
                <strong className="text-foreground">Analytics.</strong> Help us understand how
                visitors use the site so we can improve it.
              </li>
              <li>
                <strong className="text-foreground">Preference.</strong> Remember choices you make,
                like display preferences.
              </li>
            </ul>
            <p>
              You can control cookies through your browser settings. Disabling some cookies may
              affect site functionality.
            </p>
          </Section>

          <Section id="retention" title="5. How long we keep your information">
            <p>
              We retain your personal information only for as long as needed to fulfill the purposes
              described in this policy, unless a longer retention period is required or permitted by
              law (for example, tax, accounting, or other legal requirements).
            </p>
            <p>
              Where you have an account with us, we generally retain your account information for
              up to 12 months after the account becomes idle, after which we will delete or
              anonymize it. Records related to invoicing and contracts may be retained longer to
              meet legal and financial obligations.
            </p>
          </Section>

          <Section id="security" title="6. How we keep your information safe">
            <p>
              We maintain organizational and technical safeguards designed to protect your personal
              information, including encryption in transit, access controls, and regular review of
              our security practices. Payment data is handled by Stripe under PCI-DSS standards and
              is never stored on our servers.
            </p>
            <p>
              No method of transmission over the internet or electronic storage is 100% secure.
              While we work hard to protect your information, we cannot guarantee absolute security.
              You are responsible for keeping your account credentials confidential.
            </p>
          </Section>

          <Section id="us-rights" title="7. Privacy rights for US residents">
            <p>
              Depending on the state in which you reside, you may have specific rights regarding
              your personal information, including the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Know what personal information we collect, use, and share</li>
              <li>Access a copy of the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of the sale or sharing of personal information (we do not sell)</li>
              <li>Opt out of targeted advertising</li>
              <li>Limit the use of sensitive personal information</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
            <p>
              These rights are available to residents of states with comprehensive consumer privacy
              laws, including California, Florida, Colorado, Connecticut, Delaware, Indiana, Iowa,
              Montana, New Hampshire, New Jersey, Oregon, Tennessee, Texas, Utah, and Virginia,
              subject to each state's specific eligibility criteria and exceptions.
            </p>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:info@buildyourfootprint.com" className="text-accent hover:underline">
                info@buildyourfootprint.com
              </a>
              . We will verify your request and respond within the timeframe required by applicable
              law. You may also designate an authorized agent to make a request on your behalf.
            </p>
            <p>
              <strong className="text-foreground">Do-Not-Track.</strong> Our Services do not
              currently respond to Do-Not-Track browser signals, as no consistent industry standard
              has been adopted.
            </p>
          </Section>

          <Section id="contact" title="8. How to contact us">
            <p>
              If you have questions or concerns about this Privacy Policy or our handling of your
              personal information, contact us at:
            </p>
            <div className="glass rounded-lg p-6 not-prose">
              <div className="font-display font-semibold text-foreground mb-2">
                Build Your Footprint Media, LLC
              </div>
              <div className="text-sm space-y-1">
                <div>1252 NW 208th Terrace</div>
                <div>Miami Gardens, FL 33169</div>
                <div className="pt-2">
                  <a href="mailto:info@buildyourfootprint.com" className="text-accent hover:underline">
                    info@buildyourfootprint.com
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.buildyourfootprint.com/contact"
                    className="text-accent hover:underline"
                  >
                    www.buildyourfootprint.com/contact
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs">
              We may update this Privacy Policy from time to time. The updated version will be
              indicated by a revised "Last updated" date and will be effective as soon as it is
              accessible.
            </p>
          </Section>
        </div>
      </article>
    </PageLayout>
  );
};

export default Privacy;
