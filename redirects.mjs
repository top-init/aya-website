/**
 * fromaya.com → ayamethod.com redirect table.
 *
 * fromaya.com is retired as a content host. Every page it used to render now
 * lives on one of two hosts:
 *
 *   www.ayamethod.com  marketing + legal (the editorial site, repo aya-websites)
 *   app.ayamethod.com  the web app (share players, email landings, auth, reactivate)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE /.well-known EXCEPTION — DO NOT ADD A CATCH-ALL RULE TO THIS TABLE.
 *
 * /.well-known/apple-app-site-association and /.well-known/assetlinks.json MUST
 * keep answering 200 with application/json on fromaya.com forever (or at least
 * until no build carrying `applinks:fromaya.com` is left in the wild). iOS
 * follows ZERO redirects when it fetches the AASA file, and every build already
 * shipped to the App Store has fromaya.com baked into its associated domains.
 * Redirecting that path silently breaks universal links for every existing
 * user — the failure is invisible in the web logs and only shows up as links
 * bouncing to Safari instead of opening the app.
 *
 * This table is therefore an explicit, finite list of the routes fromaya.com
 * actually served. There is deliberately no `/:path*` rule: a catch-all is the
 * one mechanism that could ever swallow /.well-known, so the safety property
 * is structural rather than dependent on getting a negative-lookahead regex
 * right. Anything not listed here keeps 404ing, exactly as it does today.
 * `redirects.test.mjs` fails the build if a rule ever starts matching
 * /.well-known/*.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Status code: 301, not Next's `permanent: true`. `permanent: true` emits 308,
 * which Google treats as equivalent but which older HTTP clients, in-app
 * webviews and store-review fetchers do not all follow. Every route below is a
 * GET, so 301 loses nothing and is understood by everything. The one POST
 * endpoint (/api/share-events) is deliberately NOT in this table — see below.
 *
 * NOT redirected, on purpose:
 *   /.well-known/*      see above — must stay 200 application/json
 *   /api/share-events   a POST beacon. A 301 would drop the method and body
 *                       (clients re-issue as GET); a 308 would keep the method
 *                       but turn a same-origin POST into a cross-origin one,
 *                       and this proxy exists precisely so the browser never
 *                       has to make a cross-origin call — the redirected
 *                       request would need CORS headers app.ayamethod.com does
 *                       not send. So fromaya.com keeps serving it, and share
 *                       pages still in a browser cache keep reporting opens
 *                       and plays instead of failing silently.
 *   /robots.txt, /sitemap.xml
 *                       a retiring host should keep advertising its own URLs
 *                       so crawlers re-fetch them and see the 301s. Retire
 *                       these only after Search Console's Change of Address
 *                       has completed.
 */

const WEB = "https://www.ayamethod.com";
const APP = "https://app.ayamethod.com";

/**
 * @typedef {{ source: string, destination: string, statusCode: 301 }} DomainRedirect
 */

/** @type {DomainRedirect[]} */
export const domainRedirects = [
  // ── Marketing + legal → www.ayamethod.com ────────────────────────────────
  { source: "/", destination: `${WEB}/`, statusCode: 301 },
  { source: "/privacy", destination: `${WEB}/privacy`, statusCode: 301 },
  { source: "/terms", destination: `${WEB}/terms`, statusCode: 301 },
  { source: "/support", destination: `${WEB}/support`, statusCode: 301 },
  {
    source: "/delete-account",
    destination: `${WEB}/delete-account`,
    statusCode: 301,
  },

  // ── App-functional → app.ayamethod.com ───────────────────────────────────
  // Next preserves the incoming query string when the destination declares
  // none, which is what keeps ?token=… on the magic-link and verify hops
  // working. Do not add a query to these destinations.
  {
    source: "/auth/email-link",
    destination: `${APP}/auth/email-link`,
    statusCode: 301,
  },
  { source: "/auth/verify", destination: `${APP}/auth/verify`, statusCode: 301 },
  { source: "/reactivate", destination: `${APP}/reactivate`, statusCode: 301 },
  { source: "/e/:dest", destination: `${APP}/e/:dest`, statusCode: 301 },
  { source: "/r/:sharedId", destination: `${APP}/r/:sharedId`, statusCode: 301 },
  // /s/:shareId/preview before /s/:shareId for readability; a single-segment
  // param never matches two segments, so the order is not load-bearing.
  {
    source: "/s/:shareId/preview",
    destination: `${APP}/s/:shareId/preview`,
    statusCode: 301,
  },
  { source: "/s/:shareId", destination: `${APP}/s/:shareId`, statusCode: 301 },
  // Dev-only WebGL capture page that exists to screenshot the orb into
  // public/og-orb.png. It belongs with the share player it imports from, so it
  // points at the app host — drop this rule if that repo does not port the
  // route. Nothing links to it.
  { source: "/og-orb", destination: `${APP}/og-orb`, statusCode: 301 },
];

/** Paths that must never be matched by a rule in this table. */
export const NEVER_REDIRECT = [
  "/.well-known/apple-app-site-association",
  "/.well-known/assetlinks.json",
  "/api/share-events",
];
