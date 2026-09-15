export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Value for the <html lang> attribute. */
export const htmlLang: Record<Locale, string> = { es: "es-PA", en: "en" };

/** Value for OpenGraph og:locale. */
export const ogLocale: Record<Locale, string> = { es: "es_PA", en: "en_US" };

/**
 * Turns an unprefixed path into the URL for a given locale.
 * The default locale is served from the root, so it gets no prefix.
 *
 *   localizedPath("/turismo", "en") -> "/en/turismo"
 *   localizedPath("/turismo", "es") -> "/turismo"
 *   localizedPath("/", "en")        -> "/en"
 */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path;
  if (locale === defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/**
 * Splits a pathname into its locale and the unprefixed path.
 * A pathname with no locale prefix belongs to the default locale.
 *
 *   stripLocale("/en/turismo") -> { locale: "en", path: "/turismo" }
 *   stripLocale("/turismo")    -> { locale: "es", path: "/turismo" }
 *   stripLocale("/en")         -> { locale: "en", path: "/" }
 */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
