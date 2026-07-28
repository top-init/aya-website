import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppDeeplinkRedirect } from "@/components/app-deeplink-redirect";

// Landing for lifecycle email buttons. The email links here instead of straight
// to a store listing, so a reader who still has Aya lands IN the app rather
// than on an App Store page. Same bounce as /reactivate: try the custom scheme,
// fall back to the right store. Once /e/* is claimed in the AASA + Android
// intentFilters and a build ships with it, iOS/Android open the app directly
// and this page is never seen.

// Allowlist, not a passthrough: `dest` becomes an aya:// path, so an open
// parameter would let any link shape a deep link. Unknown value → 404.
const DESTINATIONS: Record<string, { title: string; line: string }> = {
  home: { title: "Opening Aya…", line: "One moment." },
  profile: { title: "Opening Aya…", line: "Taking you to your words." },
  player: { title: "Opening Aya…", line: "Getting your session ready." },
  offer: { title: "Opening Aya…", line: "One moment." },
};

export const metadata: Metadata = {
  title: "Opening Aya",
  robots: { index: false, follow: false },
};

export default async function EmailLandingPage({
  params,
}: {
  params: Promise<{ dest: string }>;
}) {
  const { dest } = await params;
  const copy = DESTINATIONS[dest];
  if (!copy) notFound();

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="t-title2 text-[var(--color-text-primary)] mb-3">
        {copy.title}
      </h1>
      <p
        className="t-body text-[var(--color-text-secondary)] mb-8"
        id="e-status"
      >
        {copy.line}
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
      <AppDeeplinkRedirect path={dest} statusElementId="e-status" />
    </div>
  );
}
