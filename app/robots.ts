import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/checkout", "/account", "/order"],
      },
    ],
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
    host: site.url,
  };
}
