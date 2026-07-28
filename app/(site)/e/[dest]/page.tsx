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
//
// `path` is the route INSIDE the app, which is not the same string as the
// public dest. Home lives at app/(tabs)/index, i.e. the root — `aya://home`
// matches no route and lands the reader on a blank screen. Anything the app
// can't route yet points at the root for the same reason; give it a real
// route here only once one exists.
const DESTINATIONS: Record<string, { path: string; query?: string; line: string }> = {
  home: { path: "", line: "One moment." },
  profile: { path: "profile", line: "Taking you to your words." },
  player: { path: "player", line: "Getting your session ready." },
  // The offer emails land on the same monthly card the cancel funnel shows.
  // Always monthly, for everyone — a never-paid reader buys it outright (no old
  // subscription to switch from, so it's a plain purchase) and a lapsed reader
  // resubscribes on it. `source` is deliberately not `winback`: that variant
  // holds its close button for 3s, which a reader who chose to tap shouldn't get.
  // Switching which plan the offer sells = change `target` here.
  offer: {
    path: "upgrade-monthly",
    line: "One moment.",
  },
};

// Which plan the offer sheet sells. The sending journey names it in the link
// (?target=yearly for someone who lapsed off monthly), so it follows the plan
// the reader actually had instead of one hardcoded answer. Anything else, or
// nothing at all, falls back to monthly — never a broken sheet.
const OFFER_TARGETS = new Set(["monthly", "yearly"]);

// A campaign can name the exact product to sell, so its price is a Qonversion
// change rather than an app release. Shape-checked only — the app resolves the
// id against the live catalog and falls back to the plan default if it isn't a
// real product, so this just keeps junk out of the deep link.
const PRODUCT_ID = /^manifest_[a-z0-9_]{1,64}$/;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function offerQuery(
  target: string | string[] | undefined,
  product: string | string[] | undefined,
): string {
  const t = first(target);
  const safe = t && OFFER_TARGETS.has(t) ? t : "monthly";
  const p = first(product);
  const productParam = p && PRODUCT_ID.test(p) ? `&product=${p}` : "";
  return `source=email&target=${safe}${productParam}`;
}

export const metadata: Metadata = {
  title: "Opening Aya",
  robots: { index: false, follow: false },
};

export default async function EmailLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ dest: string }>;
  searchParams: Promise<{
    target?: string | string[];
    product?: string | string[];
  }>;
}) {
  const { dest } = await params;
  const copy = DESTINATIONS[dest];
  if (!copy) notFound();

  const { target, product } = await searchParams;
  const query = dest === "offer" ? offerQuery(target, product) : copy.query;

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="t-title2 text-[var(--color-text-primary)] mb-3">
        Opening Aya…
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
      <AppDeeplinkRedirect
        path={copy.path}
        query={query}
        statusElementId="e-status"
      />
    </div>
  );
}
