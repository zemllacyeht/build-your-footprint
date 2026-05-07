import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4 text-gradient-gold">{title}</h2>
    <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">{children}</div>
  </section>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-display text-lg font-semibold text-foreground mt-6 mb-2">{children}</h3>
);

const sections: Array<[string, string]> = [
  ["services", "1. Our services"],
  ["ip", "2. Intellectual property rights"],
  ["representations", "3. User representations"],
  ["prohibited", "4. Prohibited activities"],
  ["contributions", "5. User generated contributions"],
  ["contribution-license", "6. Contribution license"],
  ["management", "7. Services management"],
  ["term", "8. Term and termination"],
  ["modifications", "9. Modifications and interruptions"],
  ["governing-law", "10. Governing law"],
  ["disputes", "11. Dispute resolution"],
  ["corrections", "12. Corrections"],
  ["disclaimer", "13. Disclaimer"],
  ["liability", "14. Limitations of liability"],
  ["indemnification", "15. Indemnification"],
  ["user-data", "16. User data"],
  ["electronic", "17. Electronic communications, transactions, and signatures"],
  ["misc", "18. Miscellaneous"],
  ["contact", "19. Contact us"],
];

const Terms = () => {
  return (
    <PageLayout
      title="Terms of Service | Build Your Footprint"
      description="The legal terms governing your use of Build Your Footprint Media, LLC services."
    >
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="The agreement between you and Build Your Footprint Media, LLC."
      />

      <article className="container max-w-3xl pb-24">
        <div className="text-xs uppercase tracking-[0.2em] text-accent mb-10">
          Last updated: May 6, 2026
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed text-[15px] mb-14">
          <p>
            We are Build Your Footprint Media, LLC ("Company," "we," "us," "our"). We operate
            www.buildyourfootprint.com, as well as any other related products and services that
            refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          </p>
          <p>
            You can contact us by email at{" "}
            <a href="mailto:info@buildyourfootprint.com" className="text-accent hover:underline">
              info@buildyourfootprint.com
            </a>{" "}
            or by mail to Build Your Footprint Media, LLC, 1252 NW 208th Terrace, Miami Gardens, FL
            33169.
          </p>
          <p>
            These Legal Terms constitute a legally binding agreement made between you, whether
            personally or on behalf of an entity ("you"), and Build Your Footprint Media, LLC,
            concerning your access to and use of the Services. You agree that by accessing the
            Services, you have read, understood, and agreed to be bound by all of these Legal
            Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY
            PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
          <p>
            Supplemental terms and conditions or documents that may be posted on the Services from
            time to time are hereby expressly incorporated herein by reference. We reserve the
            right, in our sole discretion, to make changes or modifications to these Legal Terms at
            any time and for any reason. We will alert you about any changes by updating the "Last
            updated" date of these Legal Terms, and you waive any right to receive specific notice
            of each such change. It is your responsibility to periodically review these Legal Terms
            to stay informed of updates. You will be subject to, and will be deemed to have been
            made aware of and to have accepted, the changes in any revised Legal Terms by your
            continued use of the Services after the date such revised Legal Terms are posted.
          </p>
          <p>We recommend that you print a copy of these Legal Terms for your records.</p>
        </div>

        {/* Table of contents */}
        <nav aria-label="Table of contents" className="glass rounded-lg p-6 mb-14">
          <h2 className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Contents</h2>
          <ol className="space-y-2 text-sm list-none">
            {sections.map(([href, label]) => (
              <li key={href}>
                <a href={`#${href}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14">
          <Section id="services" title="1. Our services">
            <p>
              The information provided when using the Services is not intended for distribution to
              or use by any person or entity in any jurisdiction or country where such distribution
              or use would be contrary to law or regulation or which would subject us to any
              registration requirement within such jurisdiction or country. Accordingly, those
              persons who choose to access the Services from other locations do so on their own
              initiative and are solely responsible for compliance with local laws, if and to the
              extent local laws are applicable.
            </p>
          </Section>

          <Section id="ip" title="2. Intellectual property rights">
            <SubHeading>Our intellectual property</SubHeading>
            <p>
              We are the owner or the licensee of all intellectual property rights in our Services,
              including all source code, databases, functionality, software, website designs,
              audio, video, text, photographs, and graphics in the Services (collectively, the
              "Content"), as well as the trademarks, service marks, and logos contained therein
              (the "Marks").
            </p>
            <p>
              Our Content and Marks are protected by copyright and trademark laws (and various
              other intellectual property rights and unfair competition laws) and treaties around
              the world.
            </p>
            <p>
              The Content and Marks are provided in or through the Services "AS IS" for your
              personal, non-commercial use or internal business purpose only.
            </p>

            <SubHeading>Your use of our Services</SubHeading>
            <p>
              Subject to your compliance with these Legal Terms, including the "Prohibited
              activities" section below, we grant you a non-exclusive, non-transferable, revocable
              license to access the Services and download or print a copy of any portion of the
              Content to which you have properly gained access, solely for your personal,
              non-commercial use or internal business purpose.
            </p>
            <p>
              Except as set out in this section or elsewhere in our Legal Terms, no part of the
              Services and no Content or Marks may be copied, reproduced, aggregated, republished,
              uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed,
              sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without
              our express prior written permission.
            </p>
            <p>
              If you wish to make any use of the Services, Content, or Marks other than as set out
              in this section or elsewhere in our Legal Terms, please address your request to:{" "}
              <a href="mailto:info@buildyourfootprint.com" className="text-accent hover:underline">
                info@buildyourfootprint.com
              </a>
              .
            </p>
            <p>
              We reserve all rights not expressly granted to you in and to the Services, Content,
              and Marks. Any breach of these Intellectual Property Rights will constitute a
              material breach of our Legal Terms and your right to use our Services will terminate
              immediately.
            </p>

            <SubHeading>Your submissions</SubHeading>
            <p>
              By directly sending us any question, comment, suggestion, idea, feedback, or other
              information about the Services ("Submissions"), you agree to assign to us all
              intellectual property rights in such Submission. You agree that we shall own this
              Submission and be entitled to its unrestricted use and dissemination for any lawful
              purpose, commercial or otherwise, without acknowledgment or compensation to you.
            </p>
            <p>
              You are responsible for what you post or upload: by sending us Submissions through
              any part of the Services you confirm that you have read and agree with our
              "Prohibited activities" and will not post, send, publish, upload, or transmit through
              the Services any Submission that is illegal, harassing, hateful, harmful, defamatory,
              obscene, bullying, abusive, discriminatory, threatening to any person or group,
              sexually explicit, false, inaccurate, deceitful, or misleading; to the extent
              permissible by applicable law, waive any and all moral rights to any such
              Submission; warrant that any such Submission is original to you or that you have the
              necessary rights and licenses to submit such Submissions and that you have full
              authority to grant us the above-mentioned rights in relation to your Submissions;
              and warrant and represent that your Submissions do not constitute confidential
              information.
            </p>
          </Section>

          <Section id="representations" title="3. User representations">
            <p>
              By using the Services, you represent and warrant that: (1) you have the legal
              capacity and you agree to comply with these Legal Terms; (2) you are not a minor in
              the jurisdiction in which you reside; (3) you will not access the Services through
              automated or non-human means, whether through a bot, script or otherwise; (4) you
              will not use the Services for any illegal or unauthorized purpose; and (5) your use
              of the Services will not violate any applicable law or regulation.
            </p>
            <p>
              If you provide any information that is untrue, inaccurate, not current, or
              incomplete, we have the right to suspend or terminate your account and refuse any
              and all current or future use of the Services (or any portion thereof).
            </p>
          </Section>

          <Section id="prohibited" title="4. Prohibited activities">
            <p>
              You may not access or use the Services for any purpose other than that for which we
              make the Services available. The Services may not be used in connection with any
              commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p>As a user of the Services, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Systematically retrieve data or other content from the Services to create or compile a collection, compilation, database, or directory without written permission from us.</li>
              <li>Trick, defraud, or mislead us and other users.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
              <li>Disparage, tarnish, or otherwise harm us and/or the Services.</li>
              <li>Use any information obtained from the Services to harass, abuse, or harm another person.</li>
              <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
              <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
              <li>Engage in unauthorized framing of or linking to the Services.</li>
              <li>Upload or transmit viruses, Trojan horses, or other harmful material.</li>
              <li>Engage in any automated use of the system.</li>
              <li>Delete the copyright or other proprietary rights notice from any Content.</li>
              <li>Attempt to impersonate another user or person.</li>
              <li>Interfere with, disrupt, or create an undue burden on the Services.</li>
              <li>Harass, annoy, intimidate, or threaten any of our employees or agents.</li>
              <li>Attempt to bypass any measures designed to prevent or restrict access to the Services.</li>
              <li>Copy or adapt the Services' software.</li>
              <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising the Services.</li>
              <li>Use any automated system to access the Services.</li>
              <li>Make any unauthorized use of the Services.</li>
              <li>Use the Services as part of any effort to compete with us.</li>
            </ul>
          </Section>

          <Section id="contributions" title="5. User generated contributions">
            <p>
              The Services do not offer users the ability to submit or post content. We may
              provide you with the opportunity to create, submit, post, display, transmit, perform,
              publish, distribute, or broadcast content and materials to us or on the Services,
              including but not limited to text, writings, video, audio, photographs, graphics,
              comments, suggestions, or personal information or other material (collectively,
              "Contributions").
            </p>
          </Section>

          <Section id="contribution-license" title="6. Contribution license">
            <p>
              You and the Services agree that we may access, store, process, and use any
              information and personal data that you provide and your choices (including settings).
            </p>
            <p>
              By submitting suggestions or other feedback regarding the Services, you agree that we
              can use and share such feedback for any purpose without compensation to you.
            </p>
            <p>
              We do not assert any ownership over your Contributions. You retain full ownership of
              all of your Contributions and any intellectual property rights or other proprietary
              rights associated with your Contributions. We are not liable for any statements or
              representations in your Contributions. You are solely responsible for your
              Contributions to the Services.
            </p>
          </Section>

          <Section id="management" title="7. Services management">
            <p>
              We reserve the right, but not the obligation, to: (1) monitor the Services for
              violations of these Legal Terms; (2) take appropriate legal action against anyone who
              violates the law or these Legal Terms; (3) in our sole discretion and without
              limitation, refuse, restrict access to, limit the availability of, or disable any of
              your Contributions or any portion thereof; (4) remove from the Services or otherwise
              disable all files and content that are excessive in size or are in any way burdensome
              to our systems; and (5) otherwise manage the Services in a manner designed to protect
              our rights and property.
            </p>
          </Section>

          <Section id="term" title="8. Term and termination">
            <p>
              These Legal Terms shall remain in full force and effect while you use the Services.
              WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO,
              IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE
              SERVICES TO ANY PERSON FOR ANY REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY
              REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY
              APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE
              SERVICES OR DELETE ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT
              WARNING, IN OUR SOLE DISCRETION.
            </p>
            <p>
              If we terminate or suspend your account for any reason, you are prohibited from
              registering and creating a new account under your name, a fake or borrowed name, or
              the name of any third party.
            </p>
          </Section>

          <Section id="modifications" title="9. Modifications and interruptions">
            <p>
              We reserve the right to change, modify, or remove the contents of the Services at
              any time or for any reason at our sole discretion without notice. We cannot guarantee
              the Services will be available at all times. We reserve the right to change, revise,
              update, suspend, discontinue, or otherwise modify the Services at any time or for any
              reason without notice to you. You agree that we have no liability whatsoever for any
              loss, damage, or inconvenience caused by your inability to access or use the Services
              during any downtime or discontinuance of the Services.
            </p>
          </Section>

          <Section id="governing-law" title="10. Governing law">
            <p>
              These Legal Terms shall be governed by and defined following the laws of Florida,
              United States. Build Your Footprint Media, LLC and yourself irrevocably consent that
              the courts of Miami-Dade County, Florida shall have exclusive jurisdiction to resolve
              any dispute which may arise in connection with these Legal Terms.
            </p>
          </Section>

          <Section id="disputes" title="11. Dispute resolution">
            <SubHeading>Informal negotiations</SubHeading>
            <p>
              To expedite resolution and control the cost of any dispute, controversy, or claim
              related to these Legal Terms, the Parties agree to first attempt to negotiate any
              Dispute informally for at least 30 days before initiating arbitration. Such informal
              negotiations commence upon written notice from one Party to the other Party.
            </p>

            <SubHeading>Binding arbitration</SubHeading>
            <p>
              Any dispute arising out of or in connection with these Legal Terms shall be referred
              to and finally resolved by the International Commercial Arbitration Court under the
              European Arbitration Chamber (Belgium, Brussels, Avenue Louise, 146) according to
              the Rules of this ICAC. The number of arbitrators shall be 1. The seat of arbitration
              shall be Miami, Florida, United States. The language of the proceedings shall be
              English. The governing law of these Legal Terms shall be the substantive law of
              Florida, United States.
            </p>

            <SubHeading>Restrictions</SubHeading>
            <p>
              The Parties agree that any arbitration shall be limited to the Dispute between the
              Parties individually. To the full extent permitted by law, no arbitration shall be
              joined with any other proceeding; there is no right or authority for any Dispute to
              be arbitrated on a class-action basis; and there is no right or authority for any
              Dispute to be brought in a purported representative capacity on behalf of the general
              public or any other persons.
            </p>

            <SubHeading>Exceptions to informal negotiations and arbitration</SubHeading>
            <p>
              The Parties agree that the following Disputes are not subject to the above
              provisions: (a) any Disputes seeking to enforce or protect any intellectual property
              rights of a Party; (b) any Dispute related to allegations of theft, piracy, invasion
              of privacy, or unauthorized use; and (c) any claim for injunctive relief.
            </p>
          </Section>

          <Section id="corrections" title="12. Corrections">
            <p>
              There may be information on the Services that contains typographical errors,
              inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies,
              or omissions and to change or update the information on the Services at any time,
              without prior notice.
            </p>
          </Section>

          <Section id="disclaimer" title="13. Disclaimer">
            <p>
              THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE
              OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
              DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR
              USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO
              WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES'
              CONTENT AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY ERRORS, MISTAKES,
              OR INACCURACIES OF CONTENT AND MATERIALS, PERSONAL INJURY OR PROPERTY DAMAGE, ANY
              UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS, ANY INTERRUPTION OR CESSATION OF
              TRANSMISSION TO OR FROM THE SERVICES, OR ANY BUGS, VIRUSES, OR TROJAN HORSES WHICH
              MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY.
            </p>
          </Section>

          <Section id="liability" title="14. Limitations of liability">
            <p>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY
              THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
              OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER
              DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED
              HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO
              THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS
              DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF
              CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR
              LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
            </p>
          </Section>

          <Section id="indemnification" title="15. Indemnification">
            <p>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
              affiliates, and all of our respective officers, agents, partners, and employees, from
              and against any loss, damage, liability, claim, or demand, including reasonable
              attorneys' fees and expenses, made by any third party due to or arising out of: (1)
              use of the Services; (2) breach of these Legal Terms; (3) any breach of your
              representations and warranties set forth in these Legal Terms; (4) your violation of
              the rights of a third party, including but not limited to intellectual property
              rights; or (5) any overt harmful act toward any other user of the Services.
            </p>
          </Section>

          <Section id="user-data" title="16. User data">
            <p>
              We will maintain certain data that you transmit to the Services for the purpose of
              managing the performance of the Services. Although we perform regular routine backups
              of data, you are solely responsible for all data that you transmit or that relates to
              any activity you have undertaken using the Services. You agree that we shall have no
              liability to you for any loss or corruption of any such data.
            </p>
          </Section>

          <Section id="electronic" title="17. Electronic communications, transactions, and signatures">
            <p>
              Visiting the Services, sending us emails, and completing online forms constitute
              electronic communications. You consent to receive electronic communications, and you
              agree that all agreements, notices, disclosures, and other communications we provide
              to you electronically satisfy any legal requirement that such communication be in
              writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND
              OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF
              TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES.
            </p>
          </Section>

          <Section id="misc" title="18. Miscellaneous">
            <p>
              These Legal Terms and any policies or operating rules posted by us on the Services
              constitute the entire agreement and understanding between you and us. Our failure to
              exercise or enforce any right or provision of these Legal Terms shall not operate as
              a waiver of such right or provision. We may assign any or all of our rights and
              obligations to others at any time. If any provision or part of a provision of these
              Legal Terms is determined to be unlawful, void, or unenforceable, that provision is
              deemed severable from these Legal Terms and does not affect the validity and
              enforceability of any remaining provisions. There is no joint venture, partnership,
              employment or agency relationship created between you and us as a result of these
              Legal Terms or use of the Services.
            </p>
          </Section>

          <Section id="contact" title="19. Contact us">
            <p>
              In order to resolve a complaint regarding the Services or to receive further
              information regarding use of the Services, please contact us at:
            </p>
            <div className="glass rounded-lg p-6 not-prose">
              <div className="font-display font-semibold text-foreground mb-2">
                Build Your Footprint Media, LLC
              </div>
              <div className="text-sm space-y-1">
                <div>1252 NW 208th Terrace</div>
                <div>Miami Gardens, FL 33169</div>
                <div>United States</div>
                <div className="pt-2">
                  <a href="mailto:info@buildyourfootprint.com" className="text-accent hover:underline">
                    info@buildyourfootprint.com
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.buildyourfootprint.com"
                    className="text-accent hover:underline"
                  >
                    www.buildyourfootprint.com
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </article>
    </PageLayout>
  );
};

export default Terms;
