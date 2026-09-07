/**
 * fromaya.com → ayamethod.com redirect table.
 *
 * fromaya.com is retired as a content host: the app and the editorial site
 * both live on ayamethod.com now (the app at the root, editorial under
 * /<lang>/). What this table moves, and — more importantly — what it leaves
 * alone:
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE /.well-known EXCEPTION — DO NOT ADD A CATCH-ALL RULE TO THIS TABLE.
 *
 * /.well-known/apple-app-site-association and /.well-known/assetlinks.json MUST
 * keep answering 200 with application/json on fromaya.com for as long as a
 * build carrying `applinks:fromaya.com` exists in the wild. iOS follows ZERO
 * redirects when it fetches the AASA file, and every build already in the App
 * Store has fromaya.com baked into its associated domains. Redirecting that
 * path silently breaks universal links for every existing user — invisible in
 * the web logs, visible only as links bouncing to Safari.
 *
 * So this is an explicit, finite list. There is deliberately no `/:path*`
 * rule: a catch-all is the one mechanism that could ever swallow /.well-known,
 * and `redirects.test.mjs` fails the build if any rule starts matching it.
 * Anything not listed keeps doing what it does today.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 301, not Next's `permanent: true` (which emits 308): every route here is a
 * GET, and 301 is understood by older HTTP clients, in-app webviews and store
 * review fetchers alike.
 *
 * STILL SERVED HERE, on purpose — these are functional pages that links
 * already sent (emails, magic links, shares) still resolve against, and the
 * apex does not serve a like-for-like replacement:
 *   /.well-known/*       see above
 *   /api/share-events    a POST beacon; a 301 drops the body, a 308 makes it
 *                        cross-origin without CORS. Keep serving.
 *   /s/:shareId(/preview) this repo's own share player + OG/Twitter cards;
 *                        the apex renders /s/ through a different (edge)
 *                        implementation. Compare side-by-side before moving.
 *   /e/:dest             lifecycle-email landing (allowlisted aya:// bounce).
 *                        The apex has no web route for it — the app only
 *                        handles /e/* as a native intent — so a redirect would
 *                        404 every email CTA already in an inbox.
 *   /auth/email-link, /auth/verify, /reactivate
 *                        token-carrying flows that work here today; the app's
 *                        screens of the same name are not verified against
 *                        the same query shapes.
 *   /robots.txt, /sitemap.xml
 *                        a retiring host keeps advertising its own URLs so
 *                        crawlers re-fetch them and see the 301s.
 */

const APEX = "https://ayamethod.com";

/** @typedef {{ source: string, destination: string, statusCode: 301 }} DomainRedirect */

/** @type {DomainRedirect[]} */
export const domainRedirects = [
  // ── Marketing + legal → the editorial half. Straight to /en/…: the apex's
  //    own bare /privacy is a 308 onto the same place, and one hop beats two.
  { source: "/", destination: `${APEX}/`, statusCode: 301 },
  { source: "/privacy", destination: `${APEX}/en/privacy`, statusCode: 301 },
  { source: "/terms", destination: `${APEX}/en/terms`, statusCode: 301 },
  { source: "/support", destination: `${APEX}/en/support`, statusCode: 301 },
  { source: "/delete-account", destination: `${APEX}/en/delete-account`, statusCode: 301 },

  // ── Catalogue links → the app half. fromaya.com never had pages for these;
  //    they are AASA-claimed so iOS opens the app, and everyone else — Android,
  //    desktop, a crawler — got a 404. Now they get the page.
  { source: "/playlist/:id", destination: `${APEX}/playlist/:id`, statusCode: 301 },
  { source: "/creator/:handle", destination: `${APEX}/creator/:handle`, statusCode: 301 },
  { source: "/track/:id", destination: `${APEX}/track/:id`, statusCode: 301 },
  { source: "/r/:code", destination: `${APEX}/r/:code`, statusCode: 301 },
];

/** Paths that must never be matched by a rule in this table. */
export const NEVER_REDIRECT = [
  "/.well-known/apple-app-site-association",
  "/.well-known/assetlinks.json",
  "/api/share-events",
  "/s/aB3xK9pQz",
  "/s/aB3xK9pQz/preview",
  "/e/offer",
  "/auth/email-link",
  "/auth/verify",
  "/reactivate",
  "/robots.txt",
  "/sitemap.xml",
];
