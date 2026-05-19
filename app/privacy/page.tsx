import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Aya — what data we collect, how we use it, and your rights.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "May 19, 2026";
const EFFECTIVE_DATE = "May 19, 2026";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20 prose-legal">
      <header className="mb-10">
        <p className="t-eyebrow text-[var(--color-brand)] mb-3">Legal</p>
        <h1 className="t-display text-[var(--color-text-primary)] mb-3">
          Privacy Policy
        </h1>
        <p className="t-caption text-[var(--color-text-tertiary)]">
          Effective {EFFECTIVE_DATE} · Last updated {LAST_UPDATED}
        </p>
      </header>

      <p>
        This Privacy Policy explains how <strong>Lit Apps Lab LLC</strong>{" "}
        (&ldquo;Aya,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
        collects, uses, shares, and protects information when you use the Aya
        mobile application and <a href="https://fromaya.com">fromaya.com</a>{" "}
        (together, the &ldquo;Service&rdquo;).
      </p>

      <p>
        We designed Aya to be a soft, private place — not a stage. We collect
        only what we need to make the app work, and we never sell your personal
        data.
      </p>

      <h2>1. Who we are</h2>
      <p>
        The Service is operated by Lit Apps Lab LLC, located at 30 N Gould St
        Ste R, Sheridan WY 82801, United States. For privacy questions, contact
        us at <a href="mailto:info@litappslab.com">info@litappslab.com</a>.
      </p>

      <h2>2. Information we collect</h2>

      <h3>2.1 Account information</h3>
      <p>
        When you sign in, we collect your email address and the unique
        identifier provided by Apple, Google, or our email magic-link service.
        We store this on <strong>Firebase</strong> (Google Cloud) to
        authenticate you and link your subscription to your account.
        Specifically:
      </p>
      <ul>
        <li>
          <strong>Sign in with Apple</strong> — your Apple user ID and, if you
          choose to share it, your email and display name. If you choose
          &ldquo;Hide my email,&rdquo; we only receive Apple&rsquo;s private
          relay address.
        </li>
        <li>
          <strong>Sign in with Google</strong> — your Google user ID, email
          address and (where available) display name and profile photo URL.
        </li>
        <li>
          <strong>Email magic link</strong> — your email address.
        </li>
      </ul>

      <h3>2.2 Email communications</h3>
      <p>
        We may use your email address to send transactional emails (sign-in
        links, receipts) and lifecycle emails (welcome, trial reminders,
        win-back offers) delivered via <strong>Resend</strong>. You can
        unsubscribe from marketing emails at any time using the link in the
        email footer; transactional emails will still be sent where they are
        required to operate the Service.
      </p>

      <h3>2.3 Content you create</h3>
      <p>
        We store the manifestations, affirmations, gratitude entries, vision
        boards, journal notes, voice recordings, ritual selections, and any
        text or images you save inside Aya. Onboarding answers (your dreams,
        intentions, the version of you you&rsquo;re manifesting) are used to
        personalize the content the app generates for you.
      </p>

      <h3>2.4 Device &amp; usage information</h3>
      <p>
        To keep the app working and to understand which features matter, we
        automatically collect:
      </p>
      <ul>
        <li>
          Device model, operating system version, app version, language and
          region.
        </li>
        <li>
          Anonymous events such as &ldquo;manifestation generated,&rdquo;
          &ldquo;morning ritual opened,&rdquo; &ldquo;gratitude saved,&rdquo;
          crash reports and performance traces.
        </li>
        <li>A device-generated identifier used by our analytics provider.</li>
      </ul>

      <h3>2.5 Subscription information</h3>
      <p>
        If you purchase Aya Premium, the purchase is processed by Apple (App
        Store) or Google (Play Store). We do not see or store your payment
        card. We receive an anonymized subscription identifier from{" "}
        <strong>Qonversion</strong>, the service we use to validate purchases,
        so we can unlock the relevant features in your account.
      </p>

      <h3>2.6 Device anchors for account recovery (iOS)</h3>
      <p>
        On iOS, we store a small identifier in your device&rsquo;s Keychain
        (and, if you have iCloud Keychain enabled, in iCloud) so we can offer
        to silently restore your manifestations if you reinstall Aya or get a
        new device. Keychain items survive uninstall by design — this is what
        makes recovery possible. We never read the identifier without showing
        you a &ldquo;welcome back&rdquo; confirmation first.
      </p>

      <h3>2.7 Push tokens</h3>
      <p>
        If you grant notification permission, we store the push token issued by
        Apple Push Notification service or Firebase Cloud Messaging so we can
        send the notifications you opt into (e.g. morning ritual reminders,
        manifestation nudges).
      </p>

      <h2>3. How we use information</h2>
      <ul>
        <li>To provide the core features of the Service.</li>
        <li>
          To generate personalized manifestations, affirmations and rituals
          using third-party AI providers (see Section 5).
        </li>
        <li>To authenticate you and keep your account secure.</li>
        <li>To process subscription purchases and entitlements.</li>
        <li>
          To improve the app — diagnose crashes, fix bugs, understand which
          features are used and which are not.
        </li>
        <li>
          To detect and prevent abuse of the free tier (e.g. install / delete
          loops to avoid paying).
        </li>
        <li>
          To respond to your support requests and communicate important
          service-related notices.
        </li>
        <li>
          To comply with applicable laws and to protect the rights, safety, and
          property of Aya, you, and others.
        </li>
      </ul>

      <h2>4. Legal bases (EEA / UK users)</h2>
      <p>
        If you are in the European Economic Area or the United Kingdom, we rely
        on the following legal bases under the GDPR / UK GDPR:
      </p>
      <ul>
        <li>
          <strong>Contract</strong> — to provide the Service you signed up for
          (generating manifestations, saving content, syncing across devices,
          processing purchases).
        </li>
        <li>
          <strong>Legitimate interests</strong> — to keep the Service secure,
          prevent abuse, and improve features. We balance these against your
          rights.
        </li>
        <li>
          <strong>Consent</strong> — for push notifications and any optional
          analytics that require it in your region. You can withdraw consent
          at any time in your device settings.
        </li>
        <li>
          <strong>Legal obligation</strong> — when we must retain or disclose
          information to comply with the law.
        </li>
      </ul>

      <h2>5. Third-party services &amp; subprocessors</h2>
      <p>
        Aya shares the minimum necessary information with these providers,
        each acting as a processor or subprocessor on our behalf:
      </p>
      <ul>
        <li>
          <strong>Firebase (Google LLC)</strong> — authentication, Firestore
          content storage and sync, Crashlytics crash reporting.
        </li>
        <li>
          <strong>Google Cloud / Gemini, OpenAI</strong> — server-side AI
          generation of manifestations, affirmations and voice scripts.
        </li>
        <li>
          <strong>ElevenLabs</strong> — text-to-speech for whispered
          affirmations and voice rituals (used only on the text you choose to
          have read aloud).
        </li>
        <li>
          <strong>Resend (Resend, Inc.)</strong> — delivery of transactional
          and lifecycle emails (sign-in links, receipts, trial reminders).
        </li>
        <li>
          <strong>Qonversion (Qonversion Inc.)</strong> — subscription
          validation and entitlement management.
        </li>
        <li>
          <strong>PostHog</strong> — privacy-respecting product analytics and
          feature flags. Configured to use a device-generated identifier, not
          your email.
        </li>
        <li>
          <strong>Apple</strong> &amp; <strong>Google</strong> — sign-in,
          purchase processing, push notifications, app distribution.
        </li>
        <li>
          <strong>Vercel</strong> — hosting of <code>fromaya.com</code>.
        </li>
      </ul>
      <p>
        <strong>Subprocessors:</strong> Firebase (Google LLC), Resend (Resend,
        Inc.), Qonversion (Qonversion Inc.), ElevenLabs (ElevenLabs Inc.),
        OpenAI (OpenAI, L.L.C.).
      </p>

      <h2>6. AI-generated content</h2>
      <p>
        Aya uses AI to generate manifestations, affirmations, and ritual
        prompts personalized to you. The prompts we send to these models
        include the answers you give in onboarding and any explicit themes you
        request. We do not send your email, full name, or payment information
        to AI providers. Generated content belongs to you and is stored in
        your account.
      </p>

      <h2>7. Sharing &amp; disclosure</h2>
      <p>We do not sell your personal information. We share data only when:</p>
      <ul>
        <li>
          A processor listed in Section 5 needs it to deliver part of the
          Service.
        </li>
        <li>
          You explicitly choose to share content (for example, exporting a
          vision board or sending a manifestation to someone outside the app).
        </li>
        <li>
          We are required to do so by law, court order or other valid legal
          process, or to protect rights and safety.
        </li>
        <li>
          We are involved in a merger, acquisition or asset sale, in which case
          we will notify you and any successor will be bound by this Policy.
        </li>
      </ul>

      <h2>8. International transfers</h2>
      <p>
        Our processors operate primarily in the United States and the European
        Union. Where personal information is transferred outside your country,
        we rely on appropriate safeguards such as the European Commission&apos;s
        Standard Contractual Clauses.
      </p>

      <h2>9. Data retention</h2>
      <ul>
        <li>
          Account data and content are retained for as long as your account
          exists.
        </li>
        <li>
          Crash logs and analytics events are retained for up to 24 months and
          then aggregated or deleted.
        </li>
        <li>
          When you delete your account, we delete your content and account
          identifiers within 30 days, except where we are required to retain
          information by law (e.g. tax and transaction records).
        </li>
        <li>
          We may keep a small, hashed anti-abuse record (no personal content)
          for up to 12 months after deletion to detect install / delete loops
          that drain shared AI capacity for legitimate users.
        </li>
      </ul>

      <h2>10. Your rights</h2>
      <p>Depending on where you live, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Correct inaccurate information.</li>
        <li>Delete your account and associated data.</li>
        <li>Export your content in a portable format.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent where processing is based on consent.</li>
        <li>
          Lodge a complaint with your local data protection authority (EEA /
          UK users).
        </li>
      </ul>
      <p>
        You can delete your account directly inside the app under{" "}
        <em>Settings → Account → Delete account</em>, or by visiting{" "}
        <a href="/delete-account">/delete-account</a>. For other requests,
        email <a href="mailto:info@litappslab.com">info@litappslab.com</a>{" "}
        from the address on your account and we will respond within 30 days.
      </p>

      <h2>11. California residents</h2>
      <p>
        California residents have the right under the CCPA / CPRA to know what
        personal information we collect, to delete it, to correct it, and to
        opt out of any &ldquo;sale&rdquo; or &ldquo;sharing.&rdquo; We do not
        sell personal information and we do not share it for cross-context
        behavioural advertising. To exercise your rights, email{" "}
        <a href="mailto:info@litappslab.com">info@litappslab.com</a>.
      </p>

      <h2>12. Children</h2>
      <p>
        Aya is not directed at children under 13 (or under 16 in the EEA /
        UK). We do not knowingly collect personal information from children.
        If you believe a child has provided us information, please contact us
        and we will delete it.
      </p>

      <h2>13. Security</h2>
      <p>
        We use industry-standard safeguards: encryption in transit (TLS),
        encryption at rest on our database, strict access controls and audit
        logging. No method of transmission over the internet is 100% secure;
        we cannot guarantee absolute security.
      </p>

      <h2>14. Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. If we make material
        changes, we will notify you in the app and update the &ldquo;Last
        updated&rdquo; date above. Continued use of the Service after changes
        take effect means you accept the revised Policy.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions, requests or complaints? Email{" "}
        <a href="mailto:info@litappslab.com">info@litappslab.com</a> or write
        to us at:
      </p>
      <p>
        Lit Apps Lab LLC
        <br />
        30 N Gould St Ste R
        <br />
        Sheridan, WY 82801
        <br />
        United States
      </p>
    </article>
  );
}
