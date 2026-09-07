import type { NextConfig } from "next";
import { domainRedirects } from "./redirects.mjs";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // fromaya.com is retired as a content host. The table is explicit and
  // finite — read the header of redirects.mjs before touching it, above all
  // why /.well-known/* is absent. Redirects run ahead of the filesystem, so
  // these shadow the pages still in app/ without deleting them.
  async redirects() {
    return domainRedirects;
  },
};

export default config;
