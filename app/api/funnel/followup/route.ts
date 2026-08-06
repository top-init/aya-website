import { NextResponse } from "next/server";

import { forward, sessionUserId } from "@/lib/funnel/proxy";

export const dynamic = "force-dynamic";

// The three LLM calls the questionnaire makes between questions. Named actions
// rather than a passthrough path: this handler is reachable by anyone who loads
// the funnel, and a passthrough would let them post to any backend route.
const ACTIONS = {
  validate: "/validate-onboarding-answer",
  followup: "/generate-followup",
  "manifestation-followups": "/generate-manifestation-followups",
} as const;

export async function POST(request: Request) {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    action?: keyof typeof ACTIONS;
    payload?: Record<string, unknown>;
  };
  const path = body.action ? ACTIONS[body.action] : undefined;
  if (!path) return NextResponse.json({ error: "unknown_action" }, { status: 400 });

  return forward(path, {
    // user_id is taken from the cookie, never from the request body — the
    // browser must not be able to write follow-ups into another account.
    body: { ...(body.payload ?? {}), user_id: userId },
    timeoutMs: 20_000,
  });
}
