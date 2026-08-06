import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type PlanCard = { plan: string; price: string; note?: string; highlight?: boolean };

/**
 * What the paywall shows. Display only — Stripe decides what is actually
 * charged, and Checkout shows that price again before she pays, so a stale
 * string here can never become a wrong charge.
 *
 * Configured via FUNNEL_PLAN_DISPLAY (JSON array) so a price test does not need
 * a deploy. Plan keys must match WEB_FUNNEL_PLANS on the backend, which is what
 * maps them to a Stripe price and a Qonversion product.
 *
 * Pricing rules that are NOT negotiable and must hold in the Stripe config
 * these strings describe: weekly never below $3.50/week, and no free trial.
 */
export async function GET() {
  const raw = process.env.FUNNEL_PLAN_DISPLAY?.trim();
  if (!raw) return NextResponse.json({ plans: [] });
  try {
    const parsed = JSON.parse(raw);
    const plans: PlanCard[] = Array.isArray(parsed)
      ? parsed
          .filter((p) => p && typeof p.plan === "string" && typeof p.price === "string")
          .map((p) => ({
            plan: String(p.plan),
            price: String(p.price),
            note: p.note ? String(p.note) : undefined,
            highlight: Boolean(p.highlight),
          }))
      : [];
    return NextResponse.json({ plans });
  } catch {
    return NextResponse.json({ plans: [] });
  }
}
