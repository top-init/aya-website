import { NextResponse } from "next/server";

import { ensureSession } from "@/lib/funnel/session";

export const dynamic = "force-dynamic";

/** First contact: hand the browser a funnel user (or reuse the one it has). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    locale?: string;
    utm?: Record<string, string>;
  };
  try {
    const session = await ensureSession({ locale: body.locale, utm: body.utm });
    return NextResponse.json({ user_id: session.userId });
  } catch {
    // Without a user id there is nowhere to put her answers, so this is a hard
    // failure the quiz surfaces rather than silently losing everything she types.
    return NextResponse.json({ error: "session_unavailable" }, { status: 503 });
  }
}
