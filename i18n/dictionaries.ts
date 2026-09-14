/**
 * Server-only. Do not import this module from a Client Component:
 * it would pull both dictionaries into the browser bundle.
 * Client Components receive the strings they render as props.
 */
import es from "./dictionaries/es.json";
import type { Locale } from "./config";

/** The shape of a dictionary. es.json is the source of truth. */
export type Dictionary = typeof es;

export function hasLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// `en` is added in Task 2. The Record annotation makes a missing key a build error.
const dictionaries: Record<Locale, Dictionary> = {
  es,
  en: es,
};
