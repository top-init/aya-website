"use client";

import { useEffect, useState } from "react";
import type { TFunction } from "i18next";

import type { PlanCard } from "@/app/api/funnel/plans/route";

import type { Moment } from "./quiz";

type Props = {
  t: TFunction;
  locale: string;
  moment: Moment | null;
};

/**
 * The offer, right after she has heard her own moment.
 *
 * Copy is the app's `paywallReveal.*` — already written, already translated,
 * and already the thing that converts in-app. The only web-specific part is
 * where the money goes: Stripe Checkout instead of the store, which is the
 * entire economic point of the funnel.
 */
export function Paywall({ t, locale, moment }: Props) {
  const [plans, setPlans] = useState<PlanCard[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/funnel/plans")
      .then((r) => r.json())
      .then((json) => setPlans(json?.plans ?? []))
      .catch(() => setPlans([]));
  }, []);

  const checkout = async (plan: string) => {
    setBusy(plan);
    setFailed(false);
    try {
      const res = await fetch("/api/funnel/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, locale }),
      });
      const json = await res.json();
      if (json?.checkout_url) {
        window.location.href = json.checkout_url as string;
        return;
      }
      setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <header className="flex flex-col gap-3 text-center">
        <p className="t-eyebrow text-[var(--color-brand)]">{t("paywallReveal.eyebrow1")}</p>
        <h1 className="t-display text-balance text-[var(--color-text-primary)]">
          {t("paywallReveal.hero")}
        </h1>
        <p className="t-body text-[var(--color-text-secondary)]">
          {t("paywallReveal.subhero")}
        </p>
      </header>

      {moment ? (
        <p className="t-serif-italic text-center text-[var(--color-text-secondary)]">
          {moment.title}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {["paywallReveal.feature2", "paywallReveal.feature3", "paywallReveal.feature4"].map(
          (key) => (
            <li
              key={key}
              className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 t-body text-[var(--color-text-primary)]"
            >
              {t(key)}
            </li>
          ),
        )}
      </ul>

      <div className="flex flex-col gap-3">
        {plans.map((card) => (
          <button
            key={card.plan}
            type="button"
            disabled={busy !== null}
            onClick={() => checkout(card.plan)}
            className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors disabled:opacity-60 ${
              card.highlight
                ? "bg-[var(--color-brand)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-brand-hover)]"
                : "border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-brand)]"
            }`}
          >
            <span className="t-body font-semibold">{card.price}</span>
            {card.note ? <span className="t-caption opacity-80">{card.note}</span> : null}
          </button>
        ))}
        {plans.length === 0 ? (
          <p className="t-caption text-center text-[var(--color-text-tertiary)]">
            {t("paywall.pendingBody")}
          </p>
        ) : null}
      </div>

      {failed ? (
        <p className="t-caption text-center text-[var(--color-text-secondary)]">
          {t("auth.errorGeneric")}
        </p>
      ) : null}

      <p className="t-caption text-center text-[var(--color-text-tertiary)]">
        {t("paywall.cancelAnytime")}
      </p>
      <nav className="flex justify-center gap-4 t-caption text-[var(--color-text-tertiary)]">
        <a href="/terms">{t("paywall.terms")}</a>
        <a href="/privacy">{t("paywall.privacy")}</a>
      </nav>
    </div>
  );
}
