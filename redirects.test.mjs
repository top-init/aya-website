/**
 * Guard rails for the fromaya.com → ayamethod.com redirect table.
 * `npm test` — Node's built-in runner, no dependencies.
 *
 * The test that matters is "never redirects /.well-known": iOS does not follow
 * redirects when it fetches the AASA file, so a rule that starts matching that
 * path breaks universal links for every build already in the App Store, and
 * nothing in a log would say so.
 */
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { domainRedirects, NEVER_REDIRECT } from "./redirects.mjs";

const APEX = "https://ayamethod.com";

/** Next `source` → RegExp. Understands `:p`, `:p*`, `:p+` so a future
 *  catch-all is caught by the tests below rather than quietly passing. */
function toRegExp(source) {
  let out = "";
  for (const segment of source.split("/").slice(1)) {
    if (segment.startsWith(":")) out += /[*+]$/.test(segment) ? "(?:/.*)?" : "/[^/]+";
    else out += "/" + segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${out || "/"}$`);
}
const matchers = domainRedirects.map((rule) => ({ ...rule, regexp: toRegExp(rule.source) }));
const resolve = (path) => matchers.find((rule) => rule.regexp.test(path));

test("never redirects /.well-known, the beacon, or a flow the apex cannot serve", () => {
  for (const path of NEVER_REDIRECT) {
    const hit = resolve(path);
    assert.equal(hit, undefined, `${path} must keep being served here, but "${hit?.source}" matches it.`);
  }
});

test("has no catch-all rule", () => {
  for (const rule of domainRedirects) {
    assert.ok(!/[*+]/.test(rule.source), `"${rule.source}" is a catch-all; the table must stay explicit so /.well-known cannot be swallowed.`);
  }
});

test("every rule is a 301 to an absolute ayamethod.com URL with no query", () => {
  for (const rule of domainRedirects) {
    assert.equal(rule.statusCode, 301, `${rule.source} is not a 301`);
    assert.ok(rule.destination.startsWith(`${APEX}/`), `${rule.source} → ${rule.destination}`);
    assert.ok(!rule.destination.includes("?"), `${rule.source} declares a query, which stops Next forwarding the incoming one`);
  }
});

test("legal pages land on the full documents, one hop", () => {
  for (const page of ["privacy", "terms", "support", "delete-account"]) {
    assert.equal(resolve(`/${page}`)?.destination, `${APEX}/en/${page}`);
  }
  assert.equal(resolve("/")?.destination, `${APEX}/`);
});

test("catalogue links that 404'd here reach their page, same path", () => {
  for (const path of ["/playlist/petra__getting-my-ex-back", "/creator/petra", "/track/petra__the-alert", "/r/aB3xK9pQz"]) {
    const hit = resolve(path);
    assert.ok(hit, `${path} has no redirect`);
    assert.equal(hit.destination.replace(/:\w+/g, "X"), `${APEX}${hit.source.replace(/:\w+/g, "X")}`);
  }
});

test("negative control: a catch-all WOULD be caught", () => {
  const rogue = [...domainRedirects, { source: "/:path*", destination: `${APEX}/:path*`, statusCode: 301 }]
    .map((rule) => ({ ...rule, regexp: toRegExp(rule.source) }));
  assert.ok(rogue.some((r) => r.regexp.test("/.well-known/apple-app-site-association")));
});
