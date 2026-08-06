import { NextResponse } from "next/server";

import { forward, sessionUserId } from "@/lib/funnel/proxy";

export const dynamic = "force-dynamic";

/**
 * Persist the persona built from her answers — the same PUT /user/{id} the app
 * makes, so a funnel user is indistinguishable from an app user downstream.
 */
export async function PUT(request: Request) {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    persona?: Record<string, unknown>;
    locale?: string;
    tz_identifier?: string;
  };
  if (!body.persona || typeof body.persona !== "object") {
    return NextResponse.json({ error: "persona_required" }, { status: 400 });
  }
  return forward(`/user/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: {
      persona: body.persona,
      locale: body.locale,
      tz_identifier: body.tz_identifier,
    },
  });
}
