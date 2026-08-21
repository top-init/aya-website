import type { NextConfig } from "next";
import { domainRedirects } from "./redirects.mjs";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // fromaya.com is retired: everything 301s to www./app.ayamethod.com. The
  // table is explicit and finite — read the header of redirects.mjs before
  // touching it, in particular why /.well-known/* and /api/share-events are
  // absent. Redirects run ahead of the filesystem, so these shadow the pages
  // still in app/ rather than requiring them to be deleted.
  async redirects() {
    return domainRedirects;
  },
};

export default config;
