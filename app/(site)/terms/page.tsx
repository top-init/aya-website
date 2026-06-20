import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Aya — the rules for using the Aya app and website.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "May 19, 2026";
const EFFECTIVE_DATE = "May 19, 2026";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20 prose-legal">
      <header className="mb-10">
        <p className="t-eyebrow text-[var(--color-brand)] mb-3">Legal</p>
        <h1 className="t-display text-[var(--color-text-primary)] mb-3">
          Terms of Service
        </h1>
        <p className="t-caption text-[var(--color-text-tertiary)]">
          Effective {EFFECTIVE_DATE} · Last updated {LAST_UPDATED}
        </p>
      </header>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement
        between you and <strong>Lit Apps Lab LLC</strong>, a limited liability
        company registered at 30 N Gould St Ste R, Sheridan WY 82801, United
        States (&ldquo;Aya,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). They
        govern your use of the Aya mobile application and{" "}
        <a href="https://fromaya.com">fromaya.com</a> (the &ldquo;Service&rdquo;).
      </p>

      <p>
        <strong>
          By creating an account or using the Service, you agree to these
          Terms. If you do not agree, do not use the Service.
        </strong>
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 13 years old (or 16 in the EEA / UK) and able to
        form a binding contract to use Aya. If you use the Service on behalf
        of an organisation, you represent that you have authority to bind it.
      </p>

      <h2>2. Your account</h2>
      <p>
        You may create an account to link your subscription and personalize
        your content across devices. You can delete your account at any time
        via <em>Settings → Account → Delete account</em>. Deletion is
        permanent (subject to the soft-delete window described in our{" "}
        <a href="/privacy">Privacy Policy</a>).
      </p>
      <p>
        You are responsible for safeguarding your sign-in credentials and for
        all activity under your account. Sign in is provided via Apple, Google
        or email magic link. Notify us immediately at{" "}
        <a href="mailto:info@litappslab.com">info@litappslab.com</a> if you
        suspect unauthorized access.
      </p>

      <h2>3. The Service</h2>
      <p>Aya lets you:</p>
      <ul>
        <li>
          Generate personalized manifestations, affirmations and morning
          rituals using AI models (see Section 7).
        </li>
        <li>
          Create gratitude entries, journal notes, and vision boards.
        </li>
        <li>
          Listen to whispered audio affirmations and guided rituals.
        </li>
        <li>Sync your content across your devices via your account.</li>
      </ul>

      <h2>4. Subscriptions &amp; purchases</h2>
      <h3>4.1 Premium features</h3>
      <p>
        Some features require a paid subscription (&ldquo;Aya Premium&rdquo;).
        Pricing and benefits are shown in the app before you subscribe.
      </p>
      <h3>4.2 Billing</h3>
      <p>
        Subscriptions are billed by <strong>Apple</strong> through the App
        Store or by <strong>Google</strong> through Google Play, depending on
        your platform. Payment is charged to your store account at
        confirmation of purchase and renews automatically for the same period
        at the then-current price unless cancelled at least 24 hours before
        the end of the current period.
      </p>
      <h3>4.3 Trials</h3>
      <p>
        If a free trial is offered, you must cancel before the trial ends to
        avoid being charged. Cancellation timing rules above apply.
      </p>
      <h3>4.4 Managing &amp; cancelling</h3>
      <p>
        Manage or cancel your subscription in your App Store account (iOS:{" "}
        <em>Settings → Apple ID → Subscriptions</em>) or Play Store account
        (Android: <em>Play Store → profile → Payments &amp; subscriptions →
        Subscriptions</em>). Cancellation takes effect at the end of the
        current billing period.
      </p>
      <h3>4.5 Refunds</h3>
      <p>
        Refund requests are handled by Apple or Google under their respective
        policies. We cannot directly issue refunds for store-billed purchases.
        Where required by law, statutory refund rights still apply.
      </p>
      <h3>4.6 Price changes</h3>
      <p>
        We may change subscription prices for future billing periods. We will
        give you reasonable advance notice via the app or email, and you may
        cancel before the new price takes effect.
      </p>

      <h2>5. Your content</h2>
      <p>
        You retain all rights to manifestations, journal entries, photos,
        vision board content and any other material you create or save in
        Aya (&ldquo;Your Content&rdquo;). You grant us a worldwide,
        royalty-free, non-exclusive licence to host, store, reproduce,
        transmit and display Your Content solely to operate and improve the
        Service for you. This licence ends when you delete Your Content or
        your account, subject to reasonable backup retention windows.
      </p>

      <h2>6. Anti-abuse</h2>
      <p>
        Generating manifestations and audio uses significant AI capacity that
        we pay for per request. We reserve the right to detect and block
        patterns of abuse — for example repeated install / delete cycles
        intended to bypass paid limits, automated scripting, or sharing of
        free-tier credits at scale. Anti-abuse measures may include rate
        limiting, requiring sign-in earlier in the experience, or refusing
        service. These measures protect the Service for legitimate users.
      </p>

      <h2>7. AI-generated output</h2>
      <p>
        Aya uses AI models (including those provided by Google, OpenAI and
        ElevenLabs) to generate manifestations, affirmations, voice scripts
        and reflective prompts.{" "}
        <strong>Automated generation can be wrong, generic, or off-tone.</strong>{" "}
        Content produced by AI is for personal inspiration and reflection
        only. It is not advice — medical, mental-health, financial, legal or
        otherwise. If you are struggling, please reach out to a qualified
        professional or, in a crisis, your local emergency number. Sanity-check
        anything that affects real-world decisions before acting on it.
      </p>

      <h2>8. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service to violate any law or someone else&apos;s rights.</li>
        <li>
          Scrape, reverse-engineer, decompile or attempt to derive the source
          of the Service, except to the extent permitted by law.
        </li>
        <li>
          Use automated means to overwhelm or interfere with the Service,
          including bypassing rate limits or generating bulk content for
          commercial use.
        </li>
        <li>
          Generate content that targets, harasses, or harms another person,
          or that is sexually explicit involving minors, hateful, or
          encourages self-harm or violence.
        </li>
        <li>Upload malware, harmful code or content you don&apos;t have rights to.</li>
        <li>
          Resell, sublicense or commercially exploit AI output or the
          Service without our written permission.
        </li>
        <li>Impersonate others or misrepresent your affiliation.</li>
      </ul>

      <h2>9. Intellectual property</h2>
      <p>
        Aya, the Aya name and logo, the application, the website and all
        related software are owned by Lit Apps Lab LLC and protected by
        copyright, trademark and other laws. Subject to your compliance with
        these Terms, we grant you a limited, non-exclusive, non-transferable,
        revocable licence to use the Service for personal, non-commercial
        purposes.
      </p>

      <h2>10. Feedback</h2>
      <p>
        If you send us feedback or suggestions, we may use them without any
        obligation to you.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may stop using the Service at any time and delete your account
        from within the app or at <a href="/delete-account">/delete-account</a>.
        We may suspend or terminate your access if you breach these Terms,
        abuse the Service, or for legal or security reasons. Sections that by
        their nature should survive (ownership, disclaimers, liability,
        governing law) will survive termination.
      </p>

      <h2>12. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
        WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
        NON-INFRINGEMENT, AND ACCURACY OF AI-GENERATED CONTENT. WE DO NOT
        WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE OR SECURE.
        AYA IS NOT A SUBSTITUTE FOR PROFESSIONAL ADVICE.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, AYA AND ITS DIRECTORS,
        OFFICERS, EMPLOYEES AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF
        PROFITS, REVENUES, DATA OR GOODWILL, ARISING OUT OF YOUR USE OF THE
        SERVICE.
      </p>
      <p>
        OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE IS LIMITED
        TO THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE
        THE CLAIM, OR (B) USD 50.
      </p>
      <p>
        Some jurisdictions do not allow these limitations, in which case they
        apply to the maximum extent permitted by law and your statutory rights
        remain unaffected.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You agree to defend and indemnify Lit Apps Lab LLC against any claims,
        damages and costs (including reasonable legal fees) arising from your
        misuse of the Service, your violation of these Terms, or your
        infringement of any third-party rights.
      </p>

      <h2>15. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of the State of Wyoming, USA,
        without regard to its conflict of laws principles. The exclusive venue
        for any dispute not subject to arbitration is the state and federal
        courts located in Wyoming. If you are a consumer in the EEA / UK or
        elsewhere with mandatory local consumer protections, those protections
        still apply to you.
      </p>

      <h2>16. App Store / Play Store specifics</h2>
      <h3>16.1 Apple</h3>
      <p>
        These Terms are between you and Lit Apps Lab LLC, not Apple. Apple is
        not responsible for the Service or for any claims relating to it.
        Apple and its subsidiaries are third-party beneficiaries of these
        Terms and may enforce them against you.
      </p>
      <h3>16.2 Google</h3>
      <p>
        If you obtained the app via Google Play, you also agree to Google
        Play&apos;s terms. Google is not a party to these Terms but provides
        the distribution platform.
      </p>

      <h2>17. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        announced in the app or by email, and the &ldquo;Last updated&rdquo;
        date will change. Continued use of the Service after changes take
        effect constitutes acceptance.
      </p>

      <h2>18. Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:info@litappslab.com">info@litappslab.com</a> or write
        to Lit Apps Lab LLC, 30 N Gould St Ste R, Sheridan WY 82801, USA.
      </p>
    </article>
  );
}
