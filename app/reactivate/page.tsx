import type { Metadata } from "next";
import { AppDeeplinkRedirect } from "@/components/app-deeplink-redirect";

export const metadata: Metadata = {
  title: "Welcome back to Aya",
  description: "Opening Aya to bring your story back.",
  robots: { index: false, follow: false },
};

export default function ReactivatePage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="t-title2 text-[var(--color-text-primary)] mb-3">
        Opening Aya…
      </h1>
      <p
        className="t-body text-[var(--color-text-secondary)] mb-8"
        id="reactivate-status"
      >
        Hold on while we bring your story back.
      </p>
      <div
        className="mx-auto w-10 h-10 rounded-full border-2 border-[var(--color-lavender-4)] border-t-[var(--color-brand)] animate-spin"
        aria-label="Loading"
        role="status"
      />
      <noscript>
        <p className="mt-8 t-caption text-[var(--color-text-secondary)]">
          JavaScript is required. Open this link on the device where Aya is
          installed.
        </p>
      </noscript>
      <AppDeeplinkRedirect path="reactivate" statusElementId="reactivate-status" />
    </div>
  );
}
