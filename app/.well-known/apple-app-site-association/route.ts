// Apple App Site Association — enables iOS Universal Links for fromaya.com.
// Served at /.well-known/apple-app-site-association as application/json with
// NO redirect (Apple's CDN follows zero redirects). Route handler instead of a
// static public/ file so the Content-Type is guaranteed and the path needs no
// extension.
//
// appID = <AppleTeamID>.<bundleId>. iOS bundle is com.litapps.periodtracker
// (pre-rebrand id, kept to preserve installs); Team ID ZY7V5JPPDQ.
// paths claimed: the magic-link verify deep link and the reactivate link.

const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "ZY7V5JPPDQ.com.litapps.periodtracker",
        paths: ["/auth/*", "/reactivate"],
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
