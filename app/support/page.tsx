import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Aya — manifestation generation issues, sign-in, subscriptions, restoring purchases, deleting your account.",
  alternates: { canonical: "/support" },
};

const SUPPORT_EMAIL = "info@ltiappslab.com";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20">
      <header className="mb-10">
        <p className="t-eyebrow text-[var(--color-brand)] mb-3">
          Help &amp; support
        </p>
        <h1 className="t-display text-[var(--color-text-primary)] mb-4">
          We&rsquo;re{" "}
          <span className="t-serif-italic text-[var(--color-brand)]">here</span>{" "}
          for you.
        </h1>
        <p className="t-body-lg text-[var(--color-text-secondary)]">
          Most issues have a quick fix below. If you don&rsquo;t find what you
          need, email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[var(--color-brand)] underline underline-offset-2"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          and we&rsquo;ll get back to you within 1–2 business days.
        </p>
      </header>

      <section className="rounded-2xl bg-[var(--color-lavender-3)] border border-[var(--color-lavender-6)] p-6 sm:p-7 mb-12">
        <h2 className="t-title3 text-[var(--color-text-primary)] mb-2">
          Contact us directly
        </h2>
        <p className="t-body text-[var(--color-text-secondary)] mb-4">
          Email is the fastest way to reach the team. Include your device, OS
          version and a screenshot if you can.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Aya%20support`}
          className="inline-flex items-center rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white t-label px-5 py-2.5 transition-colors"
        >
          Email {SUPPORT_EMAIL}
        </a>
      </section>

      <h2 className="t-title2 text-[var(--color-text-primary)] mb-6">
        Common questions
      </h2>

      <div className="space-y-3">
        <Faq q="A manifestation, affirmation or vision board failed to generate. What do I do?">
          <p>
            Aya generates content with AI in real time — sometimes the
            connection drops or our provider rate-limits a request. If a
            generation fails:
          </p>
          <ol>
            <li>Pull to refresh or tap the generation again in 30 seconds.</li>
            <li>
              Check your connection — Aya needs internet for the first
              generation; saved content works offline.
            </li>
            <li>
              In the app: <em>Settings → Send feedback</em>, describe what you
              were trying to create, and we&rsquo;ll investigate.
            </li>
            <li>
              Or email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with a
              screenshot.
            </li>
          </ol>
        </Faq>

        <Faq q="I can't sign in.">
          <p>Try these in order:</p>
          <ol>
            <li>Force-quit Aya and reopen.</li>
            <li>
              Confirm you&rsquo;re using the same sign-in provider as last time
              — Apple, Google and email magic link each create separate
              accounts.
            </li>
            <li>
              If you used &ldquo;Sign in with Apple → Hide my email,&rdquo;
              check your Apple ID&apos;s relay forwarding settings.
            </li>
            <li>Update to the latest app version from the App Store.</li>
            <li>
              Still stuck? Email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the
              email on your account.
            </li>
          </ol>
        </Faq>

        <Faq q="I paid but Premium isn't unlocking.">
          <p>
            Open the app and go to{" "}
            <em>Settings → Manage subscription → Restore purchases</em>. This
            re-syncs your entitlement with the App Store.
          </p>
          <p>
            If that doesn&rsquo;t work, make sure you&rsquo;re signed into the
            same Apple ID that made the purchase. If you&rsquo;re still locked
            out, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{" "}
            with the order ID from your App Store receipt and we&rsquo;ll
            unblock you.
          </p>
        </Faq>

        <Faq q="How do I cancel my subscription?">
          <p>
            Subscriptions are billed by Apple or Google, so you cancel through
            them:
          </p>
          <ul>
            <li>
              <strong>iOS</strong> — Settings app → tap your name → Subscriptions
              → Aya → Cancel subscription.
            </li>
            <li>
              <strong>Android</strong> — Play Store → profile → Payments &amp;
              subscriptions → Subscriptions → Aya → Cancel.
            </li>
          </ul>
          <p>
            Cancellation takes effect at the end of the current billing period —
            you keep Premium until then.
          </p>
        </Faq>

        <Faq q="How do I get a refund?">
          <p>
            Refunds for store-billed subscriptions are handled by Apple and
            Google directly:
          </p>
          <ul>
            <li>
              <strong>Apple</strong> — visit{" "}
              <a
                href="https://reportaproblem.apple.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                reportaproblem.apple.com
              </a>
              .
            </li>
            <li>
              <strong>Google</strong> — visit{" "}
              <a
                href="https://play.google.com/store/account/orderhistory"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Play order history
              </a>
              .
            </li>
          </ul>
          <p>
            Where local consumer law gives you a statutory refund right, it
            still applies — email us if your store denies a refund you&rsquo;re
            entitled to.
          </p>
        </Faq>

        <Faq q="How do I delete my account?">
          <p>
            In the app: <em>Settings → Account → Delete account</em>. Or
            request deletion at{" "}
            <Link
              href="/delete-account"
              className="text-[var(--color-brand)] underline"
            >
              fromaya.com/delete-account
            </Link>
            .
          </p>
          <p>
            We delete your content and account identifiers within 30 days. See
            our{" "}
            <Link
              href="/privacy"
              className="text-[var(--color-brand)] underline"
            >
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </Faq>

        <Faq q="Can I export my manifestations and vision boards?">
          <p>
            Yes — open any manifestation or vision board and tap the share
            icon. You can export as a PDF, image, or copy as plain text to
            another app. Bulk export of your full library is on the roadmap;
            email us if you need it sooner.
          </p>
        </Faq>

        <Faq q="Will my data sync across iPhone and iPad (or Android)?">
          <p>
            Yes, as long as you sign in with the same provider (Apple, Google
            or email) on both devices. Apple sign-in is iOS-only — if you plan
            to use Android, use Google or email magic link.
          </p>
        </Faq>

        <Faq q="Which countries is Aya available in?">
          <p>
            Aya is available globally on the App Store. The interface is
            translated into 30+ languages and your generated manifestations
            adapt to the language you write in.
          </p>
        </Faq>

        <Faq q="The share-to-Aya button doesn't appear in my share sheet (iOS).">
          <p>
            iOS hides new share extensions inside the <strong>More</strong>{" "}
            menu the first time. Open the share sheet, tap{" "}
            <strong>More</strong>, find Aya in the list, enable it, then drag
            it up to the top row so it&rsquo;s always visible.
          </p>
          <p>
            On Android, restart the device after installing Aya if the share
            target doesn&rsquo;t show up.
          </p>
        </Faq>
      </div>

      <section className="mt-16 rounded-2xl border border-[var(--color-border-subtle)] p-6 sm:p-7 bg-[var(--color-surface)]">
        <h2 className="t-title3 text-[var(--color-text-primary)] mb-2">
          Still stuck?
        </h2>
        <p className="t-body text-[var(--color-text-secondary)] mb-4">
          Email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[var(--color-brand)] underline"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          with:
        </p>
        <ul className="list-disc pl-5 space-y-1 t-body text-[var(--color-text-secondary)]">
          <li>Your device (e.g. iPhone 15 Pro, Pixel 8) and OS version.</li>
          <li>The Aya app version (Settings → About).</li>
          <li>What you tried and what happened — screenshots help a lot.</li>
        </ul>
      </section>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-[var(--color-border-subtle)] bg-white open:bg-[var(--color-lavender-2)] open:border-[var(--color-lavender-6)] transition-colors">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5">
        <span className="t-subtitle text-[var(--color-text-primary)]">
          {q}
        </span>
        <span
          aria-hidden
          className="shrink-0 mt-1 text-[var(--color-brand)] text-lg transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="px-5 pb-5 t-body text-[var(--color-text-secondary)] space-y-3 prose-legal">
        {children}
      </div>
    </details>
  );
}
