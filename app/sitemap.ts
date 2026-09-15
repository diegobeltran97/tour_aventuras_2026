import type { MetadataRoute } from "next";
import { localizedPath, locales } from "@/i18n/config";
import { siteUrl } from "@/i18n/seo";

const routes = ["/", "/turismo"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(route, locale)}`,
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.8,
      alternates: {
        languages: {
          "es-PA": `${siteUrl}${localizedPath(route, "es")}`,
          en: `${siteUrl}${localizedPath(route, "en")}`,
          "x-default": `${siteUrl}${localizedPath(route, "es")}`,
        },
      },
    })),
  );
}
