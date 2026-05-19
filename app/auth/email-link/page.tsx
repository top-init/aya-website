import type { Metadata } from "next";
import { EmailLinkRedirect } from "./redirect";

export const metadata: Metadata = {
  title: "Sign in to Aya",
  description: "Opening Aya to finish signing in.",
  robots: { index: false, follow: false },
};

export default function EmailLinkPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="t-title2 text-[var(--color-text-primary)] mb-3">
        Opening Aya…
      </h1>
      <p
        className="t-body text-[var(--color-text-secondary)] mb-8"
        id="email-link-status"
      >
        Hold on while we hand you back to the app.
      </p>
      <div
        className="mx-auto w-10 h-10 rounded-full border-2 border-[var(--color-lavender-4)] border-t-[var(--color-brand)] animate-spin"
        aria-label="Loading"
        role="status"
      />
      <noscript>
        <p className="mt-8 t-caption text-[var(--color-text-secondary)]">
          JavaScript is required to finish signing in. Open this link in your
          phone&rsquo;s default browser.
        </p>
      </noscript>
      <EmailLinkRedirect />
    </div>
  );
}
