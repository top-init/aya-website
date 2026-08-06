import { cookies } from "next/headers";

import { SHARE_API_BASE } from "@/app/s/[shareId]/mock-data";

// The funnel user id is the key to everything downstream — her answers, her
// purchase, and ultimately her entitlement. It lives in an httpOnly cookie so
// the browser cannot swap it for someone else's id, and every backend call goes
// through our route handlers rather than from the page directly.
export const SESSION_COOKIE = "aya_funnel_uid";
const MAX_AGE_S = 60 * 60 * 24 * 30;

export type FunnelSession = { userId: string };

export async function readSession(): Promise<FunnelSession | null> {
  const jar = await cookies();
  const userId = jar.get(SESSION_COOKIE)?.value?.trim();
  return userId ? { userId } : null;
}

/** Ask the backend for a funnel user. The id is always minted server-side. */
export async function createSession(input: {
  locale?: string;
  utm?: Record<string, string>;
}): Promise<FunnelSession> {
  const res = await fetch(`${SHARE_API_BASE}/web/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: input.locale, utm: input.utm }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`web/session failed: ${res.status}`);
  const json = await res.json();
  const userId = String(json?.user_id || "").trim();
  if (!userId) throw new Error("web/session returned no user_id");
  return { userId };
}

export async function writeSessionCookie(session: FunnelSession): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

/**
 * The session for the current request, creating one on first contact.
 *
 * Resuming matters more here than in the app: an ad click that bounces to the
 * browser and back must not restart a 35-step questionnaire, and a purchase
 * must attach to the id that holds her answers.
 */
export async function ensureSession(input: {
  locale?: string;
  utm?: Record<string, string>;
}): Promise<FunnelSession> {
  const existing = await readSession();
  if (existing) return existing;
  const created = await createSession(input);
  await writeSessionCookie(created);
  return created;
}
