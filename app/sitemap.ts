import type { MetadataRoute } from "next";
import { listCollections, listProducts } from "@/lib/db";
import { pages, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/cart",
    "/checkout",
    "/track-order",
    "/search",
    "/wishlist",
    "/contact",
    "/faq",
    "/pages/about",
    "/pages/privacy",
    "/pages/shipping",
    "/pages/refund",
    "/pages/terms",
    "/account",
    "/account/login",
    "/account/register",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }));

  let collections: MetadataRoute.Sitemap = [];
  let products: MetadataRoute.Sitemap = [];
  try {
    collections = listCollections().map((c) => ({
      url: `${base}/collections/${c.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    products = listProducts({}).map((p) => ({
      url: `${base}/products/${p.handle}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // database may not be available during very first build
  }

  const extraPages = Object.keys(pages)
    .filter((p) => !["about", "privacy", "shipping", "refund", "terms"].includes(p))
    .map((handle) => ({
      url: `${base}/pages/${handle}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...collections, ...products, ...extraPages];
}
