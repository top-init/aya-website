import type { Metadata } from "next";
import { headers } from "next/headers";

import { bundleFor, resolveLocale } from "@/lib/funnel/i18n";

import { Quiz } from "./quiz";

export const metadata: Metadata = {
  title: "Start with Aya",
  description:
    "Answer a few questions and hear the first moment Aya makes for you — in your name, about your life.",
  // A paid-traffic landing page has no business in search results competing
  // with the real site, and the answers behind it are personal.
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * The web2app funnel: the app's onboarding, rendered in a browser.
 *
 * The questions, their order, their branching and their copy all come from
 * vendor/onboarding-flow — the same source the app builds its questionnaire
 * from. Nothing about the flow is authored here; this file only picks the
 * locale and hands the right bundle to the client.
 */
export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const headerList = await headers();
  const requested =
    (typeof params.lang === "string" ? params.lang : undefined) ??
    headerList.get("accept-language");
  const locale = resolveLocale(requested);

  // utm_* is reporting; fbclid/ttclid are what let a purchase be attributed to
  // the ad click that caused it, server-side, hours later. Captured here
  // because the query string only exists on this first hit.
  const utm: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== "string") continue;
    if (key.startsWith("utm_") || key === "fbclid" || key === "ttclid") utm[key] = value;
  }

  return (
    <main className="min-h-dvh bg-[var(--color-canvas)]">
      <Quiz
        locale={locale}
        bundle={bundleFor(locale) as Record<string, unknown>}
        utm={utm}
        cancelled={params.checkout === "cancelled"}
      />
    </main>
  );
}
