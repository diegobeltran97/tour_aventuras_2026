/**
 * Server-only. Do not import this module from a Client Component:
 * it would pull both dictionaries into the browser bundle.
 * Client Components receive the strings they render as props.
 */
import es from "./dictionaries/es.json";
import en from "./dictionaries/en.json";
import type { Locale } from "./config";

/** The shape of a dictionary. es.json is the source of truth. */
export type Dictionary = typeof es;

export function hasLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// The Record<Locale, Dictionary> annotation means a missing or mistyped key
// in en.json is a compile error, not a silent runtime gap.
const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
};
