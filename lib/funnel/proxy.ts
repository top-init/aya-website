import { NextResponse } from "next/server";

import { SHARE_API_BASE } from "@/app/s/[shareId]/mock-data";
import { readSession } from "@/lib/funnel/session";

/**
 * Every funnel call the browser makes goes through this: same-origin in, our
 * server out.
 *
 * Three reasons it is not a direct browser→backend call:
 *   - the funnel user id stays in an httpOnly cookie, so a visitor cannot point
 *     their answers (or their purchase) at somebody else's id;
 *   - the backend needs no browser CORS surface for the funnel at all;
 *   - generation is real money (LLM + TTS) on cold traffic, so the one place
 *     that can throttle or gate it is ours.
 */
export async function forward(
  path: string,
  init: { method?: string; body?: unknown; timeoutMs?: number } = {},
): Promise<NextResponse> {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? 30_000);
  try {
    const res = await fetch(`${SHARE_API_BASE}${path}`, {
      method: init.method ?? "POST",
      headers: { "Content-Type": "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await res.text();
    const json = text ? safeJson(text) : {};
    return NextResponse.json(json, { status: res.status });
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      { error: aborted ? "upstream_timeout" : "upstream_unreachable" },
      { status: 504 },
    );
  } finally {
    clearTimeout(timer);
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { error: "bad_upstream_response" };
  }
}

export async function sessionUserId(): Promise<string | null> {
  return (await readSession())?.userId ?? null;
}
