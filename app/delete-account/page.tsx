import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete your account",
  description:
    "Request deletion of your Aya account and all associated data.",
  alternates: { canonical: "/delete-account" },
};

const SUPPORT_EMAIL = "info@litappslab.com";

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-16 sm:py-20">
      <header className="mb-10">
        <p className="t-eyebrow text-[var(--color-brand)] mb-3">Account</p>
        <h1 className="t-display text-[var(--color-text-primary)] mb-4">
          Delete your Aya account
        </h1>
        <p className="t-body-lg text-[var(--color-text-secondary)]">
          You can delete your Aya account at any time. Deletion is permanent —
          your manifestations, gratitude entries, vision boards and rituals
          cannot be recovered.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 sm:p-7 mb-8">
        <h2 className="t-title3 text-[var(--color-text-primary)] mb-3">
          Option 1 — Delete from inside the app (fastest)
        </h2>
        <ol className="list-decimal pl-5 space-y-2 t-body text-[var(--color-text-secondary)]">
          <li>Open Aya.</li>
          <li>
            Tap <strong>Settings</strong> → <strong>Account</strong>.
          </li>
          <li>
            Tap <strong>Delete account</strong> and confirm.
          </li>
        </ol>
        <p className="t-caption text-[var(--color-text-tertiary)] mt-4">
          Your account enters a 30-day soft-delete window during which you can
          change your mind by signing back in. After 30 days, all your content
          is permanently removed.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 sm:p-7 mb-8">
        <h2 className="t-title3 text-[var(--color-text-primary)] mb-3">
          Option 2 — Email request
        </h2>
        <p className="t-body text-[var(--color-text-secondary)] mb-4">
          If you can&rsquo;t access the app, email us from the address on your
          account so we can verify it&rsquo;s you:
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Delete%20my%20Aya%20account&body=Please%20delete%20my%20Aya%20account%20and%20all%20associated%20data.%0A%0ASign-in%20method%20(Apple%20%2F%20Google%20%2F%20email):%20`}
          className="inline-flex items-center rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white t-label px-5 py-2.5 transition-colors"
        >
          Email a deletion request
        </a>
        <p className="t-caption text-[var(--color-text-tertiary)] mt-4">
          Tell us which sign-in method you used (Apple, Google or email magic
          link). We confirm deletion by reply within 5 business days and
          finish within 30 days.
        </p>
      </section>

      <section className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-6 sm:p-7">
        <h2 className="t-title3 text-[var(--color-text-primary)] mb-3">
          What gets deleted
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 t-body text-[var(--color-text-secondary)]">
          <li>Your account identifiers (Apple / Google / email).</li>
          <li>
            All manifestations, affirmations, gratitude entries, journal
            notes, vision boards and voice recordings.
          </li>
          <li>Onboarding answers and personalization profile.</li>
          <li>Push notification tokens for your devices.</li>
          <li>Linked analytics events tied to your account.</li>
        </ul>

        <h2 className="t-title3 text-[var(--color-text-primary)] mt-7 mb-3">
          What we keep, briefly
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 t-body text-[var(--color-text-secondary)]">
          <li>
            Anonymized purchase/transaction records required for tax and
            accounting (no manifestations attached).
          </li>
          <li>
            A small, hashed anti-abuse record (no personal content) for up to
            12 months — protects shared AI capacity against install / delete
            loops.
          </li>
          <li>
            Aggregated, non-identifiable usage statistics that cannot be
            linked back to you.
          </li>
        </ul>

        <p className="t-caption text-[var(--color-text-tertiary)] mt-6">
          Note: cancelling your subscription is separate. If you have an
          active Premium subscription, cancel it in the{" "}
          <strong>App Store</strong> or <strong>Play Store</strong> first —
          see{" "}
          <Link href="/support" className="text-[var(--color-brand)] underline">
            Support
          </Link>{" "}
          for steps. For more details on what data we hold, read our{" "}
          <Link href="/privacy" className="text-[var(--color-brand)] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
