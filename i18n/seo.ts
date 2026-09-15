import { localizedPath, type Locale } from "./config";

export const siteUrl = "https://www.touraventuraspty.com";

/**
 * Self-referencing canonical plus the full reciprocal hreflang cluster.
 * Every page lists every language including itself, which is what Google
 * requires before it will accept the cluster. x-default points at Spanish.
 */
export function alternatesFor(path: string, locale: Locale) {
  return {
    canonical: localizedPath(path, locale),
    languages: {
      "es-PA": localizedPath(path, "es"),
      en: localizedPath(path, "en"),
      "x-default": localizedPath(path, "es"),
    },
  };
}
