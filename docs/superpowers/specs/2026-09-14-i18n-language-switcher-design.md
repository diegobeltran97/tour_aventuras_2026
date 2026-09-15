# Design: Spanish/English language switcher with SEO-correct i18n

**Date:** 2026-09-14
**Status:** Approved
**Stack:** Next.js 16.2.6 (App Router), React 19.2.4, Tailwind v4, TypeScript

## Problem

The site is written entirely in Spanish, hardcoded in JSX across two routes
(`/` corporate, `/turismo` tourism) and eight components. English-speaking
visitors — business travelers and tourists, a large share of the target market —
have no way to read it. There is also no mechanism that would keep a second
language from drifting out of sync with the first as copy changes.

## Goals

1. Every page available in Spanish and English, switchable from a visible control.
2. Each language on its own crawlable URL, correctly cross-linked for search engines.
3. Adding or changing copy later cannot silently leave one language behind.
4. No regression to the URLs currently indexed.

## Non-goals

- Locales beyond `es` and `en`.
- Translated route slugs (`/en/tours` instead of `/en/turismo`). See *Future options*.
- Automatic locale detection or redirect. See *Decisions*.
- A translation-management SaaS, CMS, or machine-translation pipeline.

## Decisions

| Decision | Choice | Reasoning |
|---|---|---|
| URL strategy | Spanish unprefixed at root, English under `/en` | Preserves every currently indexed URL; no 301 on the homepage |
| Locale detection | None — switcher only | Google's guidance prefers stable URLs; `Accept-Language` redirects surprise users and complicate crawling |
| Library | None; native dictionaries per the Next.js 16 App Router guide | Content is static marketing copy with no plurals, dates, or currency formatting — the only things a library would buy. Zero KB added to the client bundle |
| Preference persistence | None | With no auto-redirect there is nothing to consume a stored preference; the language lives in the URL |

## Architecture

### File layout

```
app/
  [lang]/
    layout.tsx           root layout: <html lang>, generateMetadata, generateStaticParams
    page.tsx             corporate home
    turismo/page.tsx     tourism page
    not-found.tsx        localized 404
  sitemap.ts
  robots.ts
  globals.css            unchanged
  icon.svg               unchanged (root-segment metadata file, applies to all routes)
  favicon.ico            unchanged
proxy.ts                 Next 16 renamed middleware.ts -> proxy.ts
i18n/
  config.ts              locales, default, html/og lang maps, path helpers
  dictionaries.ts        loader + hasLocale type guard
  dictionaries/es.json   source of truth
  dictionaries/en.json   typed as `typeof es.json`
components/
  LanguageSwitcher.tsx   new
  ...existing eight, converted to presentational
docs/superpowers/specs/  this document
```

`app/layout.tsx`, `app/page.tsx`, and `app/turismo/page.tsx` are removed; their
content moves under `app/[lang]/`. `app/[lang]/layout.tsx` becomes the root
layout and renders `<html>`/`<body>` — the Next.js i18n guide explicitly
supports nesting the root layout inside the locale segment.

### Routing

`proxy.ts` keeps one physical copy of each page while hiding the `/es` prefix:

| Incoming request | Action | Purpose |
|---|---|---|
| `/en`, `/en/turismo` | pass through | already carries a locale |
| `/es`, `/es/turismo` | **301 redirect** to `/`, `/turismo` | removes the duplicate-content twin |
| `/`, `/turismo`, any other path | **rewrite** to `/es/...`, URL unchanged | Spanish served from the root |

Matcher excludes Next internals and static files: `'/((?!_next|api|.*\\..*).*)'`.

A rewrite (not a redirect) means the browser and Google only ever see `/turismo`,
while the router resolves `lang = "es"`. All four URLs are prerendered at build
time via `generateStaticParams`.

### Dictionaries

`i18n/config.ts`:

```ts
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const htmlLang: Record<Locale, string> = { es: "es-PA", en: "en" };
export const ogLocale: Record<Locale, string> = { es: "es_PA", en: "en_US" };

/** "/turismo" + "en" -> "/en/turismo"; "/turismo" + "es" -> "/turismo" */
export function localizedPath(path: string, locale: Locale): string;

/** "/en/turismo" -> { locale: "en", path: "/turismo" } */
export function stripLocale(pathname: string): { locale: Locale; path: string };
```

`i18n/dictionaries.ts`:

```ts
const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

// type-only: es.json is never pulled into the runtime graph by this line
export type Dictionary = typeof import("./dictionaries/es.json")["default"];
export const hasLocale = (l: string): l is Locale => l in dictionaries;
export const getDictionary = async (l: Locale): Promise<Dictionary> =>
  dictionaries[l]();
```

`en.json` is declared as `Dictionary` so **a missing or misspelled English key is
a TypeScript build error**, not a blank space on the rendered page. This is the
mechanism that satisfies goal 3.

The loader must only be imported from Server Components. The `server-only`
package would enforce this at build time; it is deliberately not added, to keep
the dependency count at zero. The rule is instead documented at the top of
`dictionaries.ts`.

### Dictionary shape

Keys mirror the component tree, so a component's slice is obvious from its name:

```
nav              brand, links.services, links.philosophy, cta, openMenu,
                 closeMenu, location
modeToggle       corporate, tourism, ariaLabel
languageSwitcher ariaLabel
hero             badge, title.{before,highlight,after}, subtitle,
                 ctaPrimary, ctaSecondary
clients          title
services         eyebrow, title, subtitle, badge,
                 items.{mobility,travel,mice}.{title,description,features[3]}
philosophy       imageAlt, title.{before,highlight}, intro,
                 pillars.{logistics,management,support}.{title,description}
planner          badge, title, subtitle, label, placeholder, button
contact          title, subtitle, fields.*.{label,placeholder},
                 serviceOptions[4], submit, demoAlert
footer           brandSuffix, location, socialLinkedin, socialInstagram
tourism          hero.*, stats[4].label, sections.*.{label,title,description},
                 includesLabel, tours.<id>.{name,duration,description,
                 includes[],note?}, cta.*, footer.*
meta             siteName, ogAlt, home.{title,description},
                 turismo.{title,description}
```

Headlines that contain a gradient-highlighted span are split into
`before`/`highlight`/`after` rather than stored as one string with markup, so
each language can place the highlighted phrase where its own word order puts it.

Tourism tour data is content, so it moves into the dictionary keyed by a stable
id (`city_tour`, `city_tour_night`, `nightlife`, `gamboa`, `san_blas`, `embera`,
`transito`, `zona_libre`). The image import and icon for each tour stay in the
TSX, keyed by the same id. Adding a tour means one entry in each JSON file and
one line in the image map.

### Components

Every section component becomes presentational, receiving only its own slice:

```tsx
<HeroSection t={dict.hero} />
<TurismoPage t={dict.tourism} />
```

The three client components (`Navbar`, `ModeToggle`, `AIPlannerSection`) receive
their strings as props. No dictionary reaches the browser bundle — only the
strings actually rendered, already inlined in the server-rendered HTML.

`ModeToggle` additionally needs the current locale so its corporate/tourism links
stay in-language (`/en` <-> `/en/turismo`, `/` <-> `/turismo`).

### Language switcher

`components/LanguageSwitcher.tsx` — a client component that reads
`usePathname()`, strips or adds the `/en` prefix via the `i18n/config.ts`
helpers, and renders **two real `<Link>` elements** labelled `ES` and `EN`, each
carrying `hrefLang` and `aria-current`.

Real anchors, not `router.push`, because the crawler follows links: this is how
Google discovers the English side of the site in the first place. Switching from
`/turismo` lands on `/en/turismo` — the same page, not the homepage.

Placement: desktop navbar (next to `ModeToggle`), mobile drawer, and the
tourism page header.

### SEO

Per page, per locale, via `generateMetadata`:

- Title, description, OpenGraph and Twitter cards in the page's own language
- `alternates.canonical` — self-referencing, unprefixed for Spanish
- `alternates.languages` — `es-PA`, `en`, and `x-default` pointing at Spanish,
  present on all four URLs and reciprocal (each page lists every language
  including itself, which is what Google requires to accept the cluster)
- `openGraph.locale` plus `alternateLocale`
- `<html lang="es-PA">` / `<html lang="en">` from `htmlLang[locale]`

Site-wide:

- `app/sitemap.ts` — four entries, each carrying its own `alternates.languages`
  so the hreflang cluster is declared in the sitemap as well as in the markup
- `app/robots.ts` — allows all, points at the sitemap
- `generateStaticParams` on the layout — all four pages prerendered

### Translation approach

All copy translated idiomatically for a business and traveler audience, not
literally. Rules:

- Brand name `Tour Aventuras PTY` is never translated.
- Panamanian proper nouns keep their Spanish names: `Casco Antiguo`,
  `Zona Libre de Colón`, `San Blas`, `Emberá`, `Lago Gatún`, `Cinta Costera`.
  Where an English reader needs orientation, a short gloss is added inside the
  English string only (e.g. "Casco Antiguo, the old quarter").
- The corporate side addresses the reader formally (`usted` in Spanish) — English
  keeps a professional register rather than importing the formality literally.
- Duration strings are localized (`4–6 horas` -> `4–6 hours`, `Todo el día` ->
  `Full day`, `Medio día` -> `Half day`).

## Error handling

- `hasLocale()` guards the `lang` param; anything else calls `notFound()`,
  which renders `app/[lang]/not-found.tsx`.
- The proxy rewrites unknown paths to `/es/<path>`, so a bad URL produces a
  Spanish 404 page rather than a routing error.
- Missing translation keys cannot reach runtime: `en.json` is type-checked
  against `es.json`, so the build fails first.

## Verification

The repository has no test framework, and adding one is out of scope for this
change. Verification is therefore:

1. `npm run build` — fails on any missing or misspelled dictionary key, and
   confirms all four routes prerender.
2. `npm run lint` — clean.
3. Manual pass over `/`, `/turismo`, `/en`, `/en/turismo`: copy renders in the
   right language, the switcher preserves the current page, and `ModeToggle`
   keeps the language.
4. View-source check on each of the four URLs: `<html lang>`, `<link rel="canonical">`,
   and the three `hreflang` alternates are correct.
5. `curl -I` on `/es` and `/es/turismo` — both return 301 to the unprefixed path.

## Future options

Deliberately deferred, recorded so the reasoning is not lost:

- **JSON-LD `TravelAgency` / `LocalBusiness` schema per locale.** A real ranking
  benefit for a tourism business, but a separate concern from the switcher.
- **Translated route slugs** (`/en/tours`). Better keyword targeting in English,
  at the cost of a pathname mapping table consulted by the proxy, the switcher,
  and the sitemap. Worth revisiting if English traffic justifies it.
- **A third locale.** The structure already supports it: add the code to
  `locales`, add a dictionary file, and the type system lists every key that
  needs a translation.
