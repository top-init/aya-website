/**
 * Guard rails for the fromaya.com → ayamethod.com redirect table.
 *
 * Run with `npm test` (Node's built-in runner — no dependencies).
 *
 * The test that actually matters is "never redirects /.well-known": iOS does
 * not follow redirects when it fetches the AASA file, so a rule that starts
 * matching that path silently breaks universal links for every build already
 * in the App Store. The failure is invisible in logs, which is exactly why it
 * is asserted here rather than left to review.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import { domainRedirects, NEVER_REDIRECT } from "./redirects.mjs";

const WEB = "https://www.ayamethod.com";
const APP = "https://app.ayamethod.com";

/**
 * Compile a Next `source` pattern to a RegExp. Deliberately covers more syntax
 * than the table uses — `:param*` and `:param+` are included so that if anyone
 * ever adds a catch-all, this matcher understands it and the /.well-known test
 * below fails instead of quietly passing.
 */
function toRegExp(source) {
  let out = "";
  for (const segment of source.split("/").slice(1)) {
    if (segment.startsWith(":")) {
      const repeating = /[*+]$/.test(segment);
      out += repeating ? "(?:/.*)?" : "/[^/]+";
    } else {
      out += "/" + segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${out || "/"}$`);
}

const matchers = domainRedirects.map((rule) => ({
  ...rule,
  regexp: toRegExp(rule.source),
}));

function resolve(path) {
  return matchers.find((rule) => rule.regexp.test(path));
}

test("never redirects /.well-known or the share-events beacon", () => {
  for (const path of NEVER_REDIRECT) {
    const hit = resolve(path);
    assert.equal(
      hit,
      undefined,
      `${path} must never be redirected, but "${hit?.source}" matches it. ` +
        `iOS follows zero redirects when fetching the AASA file.`,
    );
  }
});

test("has no catch-all rule", () => {
  for (const rule of domainRedirects) {
    assert.ok(
      !/[*+]/.test(rule.source),
      `"${rule.source}" is a catch-all; the table must stay an explicit list ` +
        `so /.well-known cannot be swallowed.`,
    );
  }
});

test("every rule is a 301 to an absolute ayamethod.com URL", () => {
  for (const rule of domainRedirects) {
    assert.equal(rule.statusCode, 301, `${rule.source} is not a 301`);
    assert.ok(
      rule.destination.startsWith(`${WEB}/`) ||
        rule.destination.startsWith(`${APP}/`),
      `${rule.source} points somewhere unexpected: ${rule.destination}`,
    );
    assert.ok(
      !rule.destination.includes("?"),
      `${rule.source} declares a query string, which stops Next from ` +
        `forwarding the incoming one (auth tokens ride on it)`,
    );
  }
});

test("marketing and legal land on the editorial site", () => {
  for (const path of ["/", "/privacy", "/terms", "/support", "/delete-account"]) {
    const hit = resolve(path);
    assert.ok(hit, `${path} has no redirect`);
    assert.equal(hit.destination, `${WEB}${path}`);
  }
});

test("app-functional paths land on the app host", () => {
  const cases = [
    ["/auth/email-link", `${APP}/auth/email-link`],
    ["/auth/verify", `${APP}/auth/verify`],
    ["/reactivate", `${APP}/reactivate`],
    ["/e/home", `${APP}/e/:dest`],
    ["/r/abc123", `${APP}/r/:sharedId`],
    ["/s/abc123", `${APP}/s/:shareId`],
    ["/s/abc123/preview", `${APP}/s/:shareId/preview`],
  ];
  for (const [path, destination] of cases) {
    const hit = resolve(path);
    assert.ok(hit, `${path} has no redirect`);
    assert.equal(hit.destination, destination, `${path} went to the wrong host`);
  }
});

test("no route is claimed twice", () => {
  const seen = new Set();
  for (const rule of domainRedirects) {
    assert.ok(!seen.has(rule.source), `duplicate rule for ${rule.source}`);
    seen.add(rule.source);
  }
});
