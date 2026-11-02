import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const LAST_UPDATED = new Date("2026-11-02");

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: LAST_UPDATED }];
}
