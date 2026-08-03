// Apple App Site Association — enables iOS Universal Links for fromaya.com.
// Served at /.well-known/apple-app-site-association as application/json with
// NO redirect (Apple's CDN follows zero redirects). Route handler instead of a
// static public/ file so the Content-Type is guaranteed and the path needs no
// extension.
//
// appID = <AppleTeamID>.<bundleId>. iOS bundle is com.litapps.periodtracker
// (pre-rebrand id, kept to preserve installs); Team ID ZY7V5JPPDQ.
// paths claimed: the magic-link verify deep link, the reactivate link, shared
// rooms, /e/* (the lifecycle-email landings), and /s/* (episode share links).
// Until a build ships that verifies a path, its links still work — the page
// bounces through the aya:// scheme — they just flash the browser first.
//
// /s/*: do NOT deploy this claim before the app release containing
// app/s/[code] ships — older builds have no /s/ route, so a claimed link
// would open the app to an unmatched-route screen instead of the web player.

const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "ZY7V5JPPDQ.com.litapps.periodtracker",
        paths: ["/auth/*", "/reactivate", "/r/*", "/e/*", "/s/*"],
      },
    ],
  },
};

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(AASA), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
