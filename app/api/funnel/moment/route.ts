import { NextResponse } from "next/server";

import { forward, sessionUserId } from "@/lib/funnel/proxy";

export const dynamic = "force-dynamic";
// Generation is LLM + TTS end to end; the app allows two minutes for it.
export const maxDuration = 300;

/**
 * Generate her first moment — the thing she came for, and the thing that makes
 * the paywall land. Same /generate-moment the app calls after onboarding.
 *
 * This is the expensive endpoint in the funnel: it costs real money per cold
 * visitor, before anyone has paid. The backend's own abuse gate can answer
 * `force_paywall`, and when it does the quiz must go straight to the paywall
 * instead of burning a generation — same rule as the app.
 */
export async function POST(request: Request) {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    persona?: Record<string, unknown>;
    language?: string;
    time_of_day?: "morning" | "evening";
  };

  return forward("/generate-moment", {
    body: {
      user_id: userId,
      persona: body.persona,
      language: body.language,
      time_of_day: body.time_of_day === "evening" ? "evening" : "morning",
    },
    timeoutMs: 120_000,
  });
}
