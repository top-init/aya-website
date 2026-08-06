import type { Metadata } from "next";
import { headers } from "next/headers";

import { StoreBadges } from "@/components/store-badges";
import { createT, resolveLocale } from "@/lib/funnel/i18n";

export const metadata: Metadata = {
  title: "You're in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Where Stripe returns her after paying.
 *
 * Two things have to be unmistakable here, because everything she paid for is
 * inside an app she has not installed yet: get the app, then open the email.
 * The email carries the claim link that attaches this purchase to the app —
 * without it she would install Aya and meet a paywall she already paid.
 *
 * Deliberately not gated on the webhook having landed. Stripe redirects
 * immediately and the webhook can be seconds behind; showing "processing" on
 * the one screen that has to instruct her would trade a real instruction for a
 * spinner.
 */
export default async function DonePage() {
  const headerList = await headers();
  const locale = resolveLocale(headerList.get("accept-language"));
  const t = createT(locale);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center gap-6 px-5 py-12 text-center">
      <h1 className="t-display text-balance text-[var(--color-text-primary)]">
        {t("auth.verifySuccess")}
      </h1>
      <ol className="flex flex-col gap-3 text-left">
        <li className="rounded-2xl bg-[var(--color-surface)] px-5 py-4 t-body text-[var(--color-text-primary)]">
          {t("claim.stepInstall")}
        </li>
        <li className="rounded-2xl bg-[var(--color-surface)] px-5 py-4 t-body text-[var(--color-text-primary)]">
          {t("claim.stepEmail")}
        </li>
      </ol>
      <StoreBadges />
      <p className="t-caption text-[var(--color-text-tertiary)]">{t("claim.emailHint")}</p>
    </main>
  );
}
