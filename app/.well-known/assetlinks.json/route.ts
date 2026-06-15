// Digital Asset Links — enables Android App Links for fromaya.com.
// Served at /.well-known/assetlinks.json as application/json.
//
// The fingerprint MUST be the SHA-256 of the PLAY APP SIGNING key
// (Play Console → Setup → App signing → "App signing key certificate"),
// NOT the upload key. Set it via the ANDROID_CERT_SHA256 env var in Vercel
// (Project → Settings → Environment Variables) so it isn't committed.
//
// Until it's set, this serves an empty fingerprint list — App Links won't
// verify, but the file is valid JSON and the rest of the site is unaffected.

const SHA256 = process.env.ANDROID_CERT_SHA256?.trim();

const ASSETLINKS = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.litapps.aya",
      sha256_cert_fingerprints: SHA256 ? [SHA256] : [],
    },
  },
];

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(JSON.stringify(ASSETLINKS), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
