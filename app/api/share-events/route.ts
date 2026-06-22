import { SHARE_API_BASE } from "../../s/[shareId]/mock-data";

/**
 * Same-origin proxy for share engagement beacons. The browser POSTs here
 * (no CORS), and we forward to the backend server-side — mirroring how the
 * share fetch in mock-data avoids CORS by running on the Next server.
 * Best-effort: analytics must never surface as an error to the client.
 */
export async function POST(req: Request) {
  try {
    const { shareId, event } = (await req.json()) as {
      shareId?: string;
      event?: string;
    };
    if (!shareId || (event !== "open" && event !== "play")) {
      return new Response(null, { status: 400 });
    }
    await fetch(
      `${SHARE_API_BASE}/public/shares/${encodeURIComponent(shareId)}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event }),
      },
    ).catch(() => {});
  } catch {
    // swallow — never fail the beacon
  }
  return new Response(null, { status: 204 });
}
