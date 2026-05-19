import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://fromaya.com/sitemap.xml",
    host: "https://fromaya.com",
  };
}
