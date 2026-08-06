import { NextResponse } from "next/server";

import { forward, sessionUserId } from "@/lib/funnel/proxy";

export const dynamic = "force-dynamic";

/**
 * Open Stripe Checkout for this funnel user.
 *
 * The client sends a PLAN KEY, never a price: prices live in backend config and
 * are resolved there, so nothing a visitor can edit decides what they are
 * charged.
 */
export async function POST(request: Request) {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    plan?: string;
    email?: string;
    locale?: string;
  };
  if (!body.plan || typeof body.plan !== "string") {
    return NextResponse.json({ error: "plan_required" }, { status: 400 });
  }
  return forward("/web/checkout", {
    body: { user_id: userId, plan: body.plan, email: body.email, locale: body.locale },
    timeoutMs: 20_000,
  });
}
