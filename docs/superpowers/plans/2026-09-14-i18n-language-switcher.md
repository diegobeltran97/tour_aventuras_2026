# ES/EN Language Switcher + SEO i18n — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the whole site in Spanish and English from separate crawlable URLs, switchable from a visible control, with a dictionary system that makes a missing translation a build error.

**Architecture:** Every route moves under an `app/[lang]/` segment. A `proxy.ts` rewrite serves Spanish from the root (`/`, `/turismo`) with no visible `/es` prefix, redirects `/es/*` to the clean URL, and passes `/en/*` through. All copy moves into two JSON dictionaries; `en.json` is type-checked against `es.json`. Components become presentational, receiving their own dictionary slice as props.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4, react-icons. No new dependencies.

**Spec:** [docs/superpowers/specs/2026-09-14-i18n-language-switcher-design.md](../specs/2026-09-14-i18n-language-switcher-design.md)

## Global Constraints

- **No new dependencies.** `package.json` must be unchanged at the end of this plan.
- **Next.js 16 conventions.** `middleware.ts` no longer exists — the file is `proxy.ts` at the project root, exporting a `proxy` function. `params` in layouts and pages is a **Promise** and must be awaited. Use the global `PageProps<'/[lang]'>` / `LayoutProps<'/[lang]'>` type helpers.
- **URL contract, never violated:** Spanish = `/` and `/turismo` (no prefix, unchanged from today). English = `/en` and `/en/turismo`. `/es` and `/es/turismo` must 301 to the unprefixed URL.
- **Brand name `Tour Aventuras PTY` / `Tour Aventuras Pty` is never translated.**
- **Panamanian proper nouns keep their Spanish names** in both dictionaries: `Casco Antiguo`, `Zona Libre de Colón`, `San Blas`, `Emberá`, `Lago Gatún`, `Cinta Costera`, `Costa del Este`, `Albrook Mall`, `Isla Perro Chico`, `Isla Wailidub`. English strings may add a short gloss after the name.
- **The dictionary is the only place copy lives.** After Task 6, no Spanish user-facing string may remain in any `.tsx` file.
- **Import alias:** `@/*` maps to the project root. Use `@/components/...`, `@/i18n/...`, `@/public/...` rather than relative `../../` paths.
- **Verification is `npm run build` + `npm run lint`.** The repo has no test framework and this plan does not add one; the typed dictionary is what replaces unit tests for translation coverage.

---

### Task 1: i18n foundation — config, loader, Spanish dictionary

Extracts every Spanish string in the codebase into `es.json` and builds the loader around it. Nothing renders from the dictionary yet; this task only has to typecheck.

**Files:**
- Create: `i18n/config.ts`
- Create: `i18n/dictionaries.ts`
- Create: `i18n/dictionaries/es.json`
- Create: `i18n/seo.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `locales: readonly ["es", "en"]`, `type Locale = "es" | "en"`, `defaultLocale: Locale`
  - `htmlLang: Record<Locale, string>`, `ogLocale: Record<Locale, string>`
  - `localizedPath(path: string, locale: Locale): string`
  - `stripLocale(pathname: string): { locale: Locale; path: string }`
  - `type Dictionary`, `hasLocale(value: string): value is Locale`, `getDictionary(locale: Locale): Dictionary` (**synchronous**)
  - `siteUrl: string`, `alternatesFor(path: string, locale: Locale)`

- [ ] **Step 1: Create `i18n/config.ts`**

```ts
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
```

- [ ] **Step 2: Create `i18n/dictionaries/es.json` with every Spanish string in the codebase**

The key tree below is **exhaustive** — every user-facing Spanish string in the repository maps to exactly one key here. Values are copied **verbatim** from the source, including punctuation, accents and the em-dashes. Source locations are given so the extraction can be checked line by line.

```json
{
  "meta": {
    "siteName": "Tour Aventuras PTY",
    "ogAlt": "Tour Aventuras PTY",
    "home": {
      "title": "Tour Aventuras PTY | Soluciones Corporativas",
      "description": "Soluciones Integrales de Movilidad y Logística Corporativa en Panamá"
    },
    "turismo": {
      "title": "Tours en Panamá | Tour Aventuras PTY",
      "description": "City tours, ecoturismo, San Blas, Emberá y Zona Libre de Colón. Descubre Panamá con guías locales profesionales."
    }
  },
  "nav": {
    "brand": "Tour Aventuras",
    "brandSuffix": "| Corporativo",
    "brandShort": "Tour Aventuras Pty",
    "logoAlt": "Tour Aventuras PTY",
    "links": { "services": "Soluciones", "philosophy": "Nuestra Filosofía" },
    "cta": "Agendar Reunión",
    "openMenu": "Abrir menú",
    "closeMenu": "Cerrar menú",
    "location": "Ciudad de Panamá, Panamá"
  },
  "modeToggle": {
    "corporate": "Corporativo",
    "tourism": "Turismo",
    "ariaLabel": "Cambiar entre sitio corporativo y turismo"
  },
  "languageSwitcher": { "ariaLabel": "Cambiar idioma" },
  "hero": {
    "badge": "División B2B Logística",
    "title": {
      "before": "Soluciones Integrales de ",
      "highlight": "Movilidad y Logística",
      "after": " Corporativa."
    },
    "subtitle": "Centralizamos los traslados, viajes y eventos de su empresa en Panamá. Un solo proveedor, facturación consolidada y precisión garantizada.",
    "ctaPrimary": "Optimizar Mis Costos",
    "ctaSecondary": "Nuestro Portafolio"
  },
  "clients": { "title": "Empresas que confían en nuestros estándares de calidad" },
  "services": {
    "eyebrow": "Nuestro Portafolio",
    "title": "Todo lo que su empresa necesita, en un solo lugar",
    "subtitle": "Elimine la fricción de gestionar múltiples proveedores. Cubrimos toda la cadena logística de su personal y ejecutivos.",
    "badge": "MÁS SOLICITADO",
    "items": {
      "mobility": {
        "title": "Movilidad y Traslados",
        "description": "Flotas ejecutivas impecables, transporte de personal y choferes capacitados. Puntualidad absoluta desde el aeropuerto hasta la oficina.",
        "features": ["Traslados Aeropuerto (VIP)", "Rutas para personal", "Vehículos a disposición"]
      },
      "travel": {
        "title": "Gestión de Viajes (TMC)",
        "description": "Emisión de tiquetes aéreos corporativos y reservas de hospedaje con tarifas competitivas. Control total de viáticos.",
        "features": ["Tiquetes aéreos globales", "Convenios hoteleros", "Asistencia 24/7 a viajeros"]
      },
      "mice": {
        "title": "Logística MICE",
        "description": "Soluciones de apoyo para Reuniones, Incentivos, Conferencias y Eventos. Organización fluida para que usted se enfoque en el contenido.",
        "features": ["Coordinación de Congresos", "Viajes de incentivo", "Logística de invitados"]
      }
    }
  },
  "philosophy": {
    "imageAlt": "Ejecutivos en Panamá",
    "title": { "before": "Su Aliado ", "highlight": "de Negocios en Panamá." },
    "intro": "Somos el socio estratégico de las empresas que se mueven por Panamá. Nos encargamos de toda la logística del viaje corporativo —traslados, agendas e imprevistos— para que su equipo se concentre en lo que realmente importa: cerrar negocios.",
    "pillars": {
      "logistics": {
        "title": "Logística Integral",
        "description": "Coordinamos traslados ejecutivos, conexiones aéreas y agendas desde un único punto de contacto. Usted delega la operación; nosotros la ejecutamos sin fricciones."
      },
      "management": {
        "title": "Gestión Corporativa",
        "description": "Una sola factura consolidada y reportes centralizados. Olvídese de coordinar múltiples proveedores: le damos control y visibilidad total del gasto de viaje."
      },
      "support": {
        "title": "Soporte Real 24/7",
        "description": "Los vuelos se retrasan y las reuniones se extienden. Un equipo dedicado está disponible las 24 horas para resolver cualquier imprevisto sin afectar a su equipo."
      }
    }
  },
  "planner": {
    "badge": "Consulta Directa",
    "title": "Planificador de Logística Corporativa",
    "subtitle": "Describa los detalles de su próximo viaje o evento corporativo y envíenos su requerimiento por WhatsApp. Le responderemos con una propuesta estratégica personalizada.",
    "label": "Describa su requerimiento (Ej: Visita de 4 directivos por 3 días, hotel cerca de Costa del Este y transporte a 2 plantas).",
    "placeholder": "Tenemos una delegación de...",
    "button": "Enviar por WhatsApp"
  },
  "contact": {
    "title": "¿Listo para optimizar la logística de su empresa?",
    "subtitle": "Agende una auditoría logística gratuita de 15 minutos. Le mostraremos cómo empresas como la suya ya están ahorrando tiempo y dinero.",
    "fields": {
      "name": { "label": "Nombre", "placeholder": "Ej. Carlos Mendoza" },
      "company": { "label": "Empresa", "placeholder": "Su Empresa" },
      "email": { "label": "Correo Corporativo", "placeholder": "carlos@empresa.com" },
      "service": { "label": "¿Qué servicio requiere optimizar?" }
    },
    "serviceOptions": [
      "Traslados y Movilidad",
      "Gestión de Viajes (Tickets/Hotel)",
      "Eventos y Logística MICE",
      "Revisión Integral (Todo)"
    ],
    "submit": "Solicitar Contacto Comercial",
    "demoAlert": "Esta es una demostración. Aquí se conectará el envío a tu correo."
  },
  "footer": {
    "brand": "Tour Aventuras Pty",
    "brandSuffix": "| Corporate",
    "logoAlt": "Tour Aventuras PTY",
    "location": "Ciudad de Panamá, Panamá"
  },
  "tourism": {
    "logoAlt": "Tour Aventuras Pty",
    "brand": "Tour Aventuras Pty",
    "hero": {
      "badge": "Turismo en Panamá",
      "title": { "before": "Descubre Panamá con ", "highlight": "Tour Aventuras Pty" },
      "subtitle": "Nos destacamos por realzar la belleza cultural, natural e histórica de nuestro hermoso país, convirtiendo cada visita en una mezcla de sensaciones y experiencias que perdurarán en los recuerdos de nuestros visitantes.",
      "ctaWhatsapp": "Consultar por WhatsApp",
      "ctaTours": "Ver todos los tours"
    },
    "stats": {
      "daily": "Servicio diario",
      "maxPassengers": "Pasajeros máx.",
      "toursAvailable": "Tours disponibles",
      "professionalGuides": "Guías profesionales"
    },
    "sections": {
      "cityTours": {
        "label": "City Tours",
        "title": "Descubre la Ciudad de Panamá",
        "description": "Tours diurnos y nocturnos por los rincones más icónicos de la capital."
      },
      "ecoTours": {
        "label": "Ecoturismo & Naturaleza",
        "title": "Vive la naturaleza panameña",
        "description": "Selva tropical, ríos, islas paradisíacas y el Canal de Panamá en una sola experiencia."
      },
      "shopping": {
        "label": "Compras",
        "title": "Zona Libre de Colón",
        "description": "La segunda zona franca más grande del mundo, en el hemisferio occidental."
      }
    },
    "includesLabel": "Incluye",
    "tours": {
      "city_tour": {
        "name": "City Tour por la Ciudad de Panamá",
        "duration": "4–6 horas",
        "description": "Comparte un medio día con nosotros conociendo la historia y lo contemporáneo de una ciudad con tan variadas culturas históricas y modernas.",
        "includes": [
          "Transporte A/C + agua y snacks",
          "Ciudad contemporánea: Cinta Costera, Teatro Balboa, Admin. del Canal",
          "Casco Antiguo: Catedral Metropolitana, Iglesia del Altar de Oro, Puente de los Enamorados",
          "Canal de Panamá y Museo del Canal",
          "Duty Free de Amador (Causeway) y Albrook Mall",
          "Guía"
        ],
        "note": null
      },
      "city_tour_night": {
        "name": "City Tour Nocturno",
        "duration": "Noche",
        "description": "Conoce un lugar mágico junto al mar donde puedes observar la Ciudad de Panamá, disfrutando de una noche cálida e histórica.",
        "includes": ["Transporte", "Paseo por el Casco Antiguo", "Calzada de Amador", "Guía"],
        "note": null
      },
      "nightlife": {
        "name": "Tour Nocturno — Vida Nocturna",
        "duration": "Noche",
        "description": "Uno de los destinos más visitados por residentes y turistas en Ciudad de Panamá debido a la variedad gastronómica, bebidas de diferentes estilos y discotecas.",
        "includes": [
          "Traslado de ida al Casco Antiguo",
          "Visita a 7 bares",
          "6 cócteles incluidos",
          "Entrada de nachos"
        ],
        "note": null
      },
      "gamboa": {
        "name": "Isla de los Monos — Gamboa",
        "duration": "Medio día",
        "description": "Adéntrate en las aguas del Lago Gatún a bordo de una lancha y descubre la asombrosa biodiversidad panameña. Observa monos, perezosos, caimanes y cientos de aves tropicales en su entorno natural, navegando por el punto más elevado del Canal de Panamá.",
        "includes": [
          "Transporte terrestre A/C",
          "Traslado en lancha por Lago Gatún",
          "Avistamiento de monos, perezosos y aves tropicales",
          "Fruta fresca y agua",
          "Guía naturalista"
        ],
        "note": null
      },
      "san_blas": {
        "name": "San Blas",
        "duration": "Todo el día",
        "description": "El tiempo se detiene en las raíces de la cultura Guna, en un lugar de arena blanca y aguas cristalinas. Visita 3 islas: Isla Perro Chico, Isla Wailidub y Piscinas Naturales.",
        "includes": [
          "Almuerzo y bebidas",
          "Transporte terrestre",
          "Transporte acuático",
          "Impuestos comarcales"
        ],
        "note": null
      },
      "embera": {
        "name": "Emberá — Comunidad Indígena",
        "duration": "6–8 horas",
        "description": "Disfruta de la biodiversidad navegando por el Río Chagres, comparte y convive a través de las raíces y tradiciones de la comunidad indígena Emberá.",
        "includes": [
          "Transporte terrestre",
          "Paseo en piragua a motor",
          "Almuerzo tradicional Emberá",
          "Merienda de fruta",
          "Visita a la cascada (según clima)"
        ],
        "note": "Mínimo 2 personas"
      },
      "transito": {
        "name": "Tránsito Parcial — Canal de Panamá",
        "duration": "6–8 horas",
        "description": "Vive el Canal de Panamá navegando a bordo de un ferry por su histórico cauce. Admira esta maravilla de la ingeniería y su funcionamiento.",
        "includes": [
          "Transporte hotel–puerto (ida y vuelta)",
          "Guía",
          "Desayuno y almuerzo",
          "Snacks"
        ],
        "note": null
      },
      "zona_libre": {
        "name": "Zona Libre de Colón",
        "duration": "Todo el día",
        "description": "Considerada la segunda zona franca más grande del mundo y la primera en el hemisferio occidental. Famosa por compras sin límite y libre de impuestos: electrónicos, licores, muebles, ropa, zapatos, joyas, relojes y perfumes de las marcas más afamadas.",
        "includes": [
          "Traslado ida y vuelta a la Zona Franca de Colón",
          "Guía",
          "Botella de agua"
        ],
        "note": null
      }
    },
    "cta": {
      "title": "¿Listo para vivir la experiencia?",
      "subtitle": "Contáctanos y diseñamos el itinerario perfecto para ti o tu grupo, sin costos ocultos.",
      "emailLabel": "Correo",
      "book": "Reservar mi tour ahora",
      "corporateQuestion": "¿Eres empresa?",
      "corporateLink": "Ver soluciones corporativas →"
    },
    "footer": { "location": "Ciudad de Panamá" }
  }
}
```

Source map for the extraction (check each one):

| Key group | Source |
|---|---|
| `meta.home.*` | [app/layout.tsx:11-14](../../../app/layout.tsx#L11-L14) — note `meta.home.title` becomes Spanish; the current value is English |
| `meta.turismo.*` | **new** — [app/turismo/page.tsx](../../../app/turismo/page.tsx) exports no metadata today |
| `nav.*` | [components/Navbar.tsx:21-24, 52-56, 78, 87, 125, 161](../../../components/Navbar.tsx) |
| `modeToggle.*` | [components/ModeToggle.tsx:6-9, 20](../../../components/ModeToggle.tsx) |
| `languageSwitcher.*` | **new** |
| `hero.*` | [components/HeroSection.tsx:18-42](../../../components/HeroSection.tsx#L18-L42) |
| `clients.title` | [components/ClientsSection.tsx:8](../../../components/ClientsSection.tsx#L8) |
| `services.*` | [components/ServicesSection.tsx:9-89](../../../components/ServicesSection.tsx) |
| `philosophy.*` | [components/PhilosophySection.tsx:12, 22-24, 26-31, 41-78](../../../components/PhilosophySection.tsx) |
| `planner.*` | [components/AIPlannerSection.tsx:29-63](../../../components/AIPlannerSection.tsx) |
| `contact.*` | [components/ContactSection.tsx:14-68](../../../components/ContactSection.tsx) |
| `footer.*` | [components/Footer.tsx:11-19](../../../components/Footer.tsx#L11-L19) |
| `tourism.tours.*` | [app/turismo/page.tsx:20-146](../../../app/turismo/page.tsx#L20-L146) |
| `tourism.hero.*`, `stats`, `sections`, `cta`, `footer` | [app/turismo/page.tsx:230-505](../../../app/turismo/page.tsx#L230-L505) |

Strings that stay in the TSX because they are **not** translatable content: client logo names (`ASOFARMA`, `sodexo`, `CEVAXIN`, `pluxe`, `Adidas`, `Huawei`), stat values (`24/7`, `150`, `8+`, `100%`), the email `contacto@touraventuraspty.com`, the phone `+507 6588-9209`, the handle `@Tour_aventuras`, the WhatsApp number `50765889209`, `LinkedIn` / `Instagram` / `WhatsApp` aria-labels, and the section anchor ids (`#servicios`, `#filosofia`, `#contacto`, `#tours`, `#ai-planner`) which must stay Spanish so existing deep links keep working.

- [ ] **Step 3: Create `i18n/dictionaries.ts`**

Note this is **synchronous** and uses static imports. Both dictionaries are ~12 KB, only ever loaded on the server, and all four pages are prerendered at build time — so there is nothing to code-split, and the `Record<Locale, Dictionary>` annotation is what turns a missing English key into a build error.

```ts
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
```

- [ ] **Step 4: Create `i18n/seo.ts`**

```ts
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
```

- [ ] **Step 5: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors. (The app itself is untouched so far, so nothing else can break.)

- [ ] **Step 6: Commit**

```bash
git add i18n
git commit -m "feat(i18n): add locale config, dictionary loader and Spanish dictionary"
```

---

### Task 2: English dictionary

**Files:**
- Create: `i18n/dictionaries/en.json`
- Modify: `i18n/dictionaries.ts` (wire `en` into the record)

**Interfaces:**
- Consumes: `Dictionary` from Task 1.
- Produces: `getDictionary("en")` returns real English content.

**Translation rules applied below:** idiomatic English for a business/traveler audience, not literal. The Spanish corporate copy addresses the reader as *usted*; English keeps a professional register rather than importing the formality. Durations are localized (`Todo el día` → `Full day`). Proper nouns per the Global Constraints, with a gloss where an English reader needs orientation (`Casco Antiguo, the old quarter`).

- [ ] **Step 1: Create `i18n/dictionaries/en.json`**

```json
{
  "meta": {
    "siteName": "Tour Aventuras PTY",
    "ogAlt": "Tour Aventuras PTY",
    "home": {
      "title": "Tour Aventuras PTY | Corporate Solutions",
      "description": "End-to-end corporate mobility and logistics solutions in Panama."
    },
    "turismo": {
      "title": "Panama Tours | Tour Aventuras PTY",
      "description": "City tours, ecotourism, San Blas, Emberá and the Colón Free Zone. Discover Panama with professional local guides."
    }
  },
  "nav": {
    "brand": "Tour Aventuras",
    "brandSuffix": "| Corporate",
    "brandShort": "Tour Aventuras Pty",
    "logoAlt": "Tour Aventuras PTY",
    "links": { "services": "Solutions", "philosophy": "Our Philosophy" },
    "cta": "Book a Meeting",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "location": "Panama City, Panama"
  },
  "modeToggle": {
    "corporate": "Corporate",
    "tourism": "Tourism",
    "ariaLabel": "Switch between the corporate and tourism site"
  },
  "languageSwitcher": { "ariaLabel": "Change language" },
  "hero": {
    "badge": "B2B Logistics Division",
    "title": {
      "before": "End-to-End ",
      "highlight": "Corporate Mobility & Logistics",
      "after": " Solutions."
    },
    "subtitle": "We centralize your company's transfers, business travel and events in Panama. One provider, one consolidated invoice, and precision you can count on.",
    "ctaPrimary": "Optimize My Costs",
    "ctaSecondary": "Our Portfolio"
  },
  "clients": { "title": "Companies that trust our quality standards" },
  "services": {
    "eyebrow": "Our Portfolio",
    "title": "Everything your company needs, in one place",
    "subtitle": "Stop juggling multiple vendors. We cover the entire logistics chain for your staff and executives.",
    "badge": "MOST REQUESTED",
    "items": {
      "mobility": {
        "title": "Mobility & Transfers",
        "description": "Spotless executive fleets, staff transport and professionally trained drivers. Absolute punctuality from the airport to the office.",
        "features": ["Airport transfers (VIP)", "Staff shuttle routes", "Vehicles on standby"]
      },
      "travel": {
        "title": "Travel Management (TMC)",
        "description": "Corporate flight ticketing and hotel bookings at competitive rates. Full control over travel expenses.",
        "features": ["Global flight tickets", "Negotiated hotel rates", "24/7 traveler assistance"]
      },
      "mice": {
        "title": "MICE Logistics",
        "description": "Support solutions for Meetings, Incentives, Conferences and Events. Seamless organization so you can focus on the content.",
        "features": ["Conference coordination", "Incentive trips", "Guest logistics"]
      }
    }
  },
  "philosophy": {
    "imageAlt": "Executives in Panama",
    "title": { "before": "Your Business ", "highlight": "Partner in Panama." },
    "intro": "We are the strategic partner for companies moving through Panama. We handle the full logistics of corporate travel — transfers, schedules and the unexpected — so your team can focus on what actually matters: closing deals.",
    "pillars": {
      "logistics": {
        "title": "End-to-End Logistics",
        "description": "We coordinate executive transfers, flight connections and schedules from a single point of contact. You delegate the operation; we run it without friction."
      },
      "management": {
        "title": "Corporate Management",
        "description": "One consolidated invoice and centralized reporting. Forget about coordinating multiple vendors — we give you full control and visibility over travel spend."
      },
      "support": {
        "title": "Real 24/7 Support",
        "description": "Flights get delayed and meetings run long. A dedicated team is available around the clock to resolve anything unexpected without disrupting your team."
      }
    }
  },
  "planner": {
    "badge": "Direct Inquiry",
    "title": "Corporate Logistics Planner",
    "subtitle": "Describe the details of your next corporate trip or event and send us your request over WhatsApp. We'll reply with a tailored strategic proposal.",
    "label": "Describe your requirement (e.g. 4 executives visiting for 3 days, hotel near Costa del Este and transport to 2 plants).",
    "placeholder": "We have a delegation of...",
    "button": "Send via WhatsApp"
  },
  "contact": {
    "title": "Ready to optimize your company's logistics?",
    "subtitle": "Book a free 15-minute logistics audit. We'll show you how companies like yours are already saving time and money.",
    "fields": {
      "name": { "label": "Name", "placeholder": "e.g. Carlos Mendoza" },
      "company": { "label": "Company", "placeholder": "Your Company" },
      "email": { "label": "Work Email", "placeholder": "carlos@company.com" },
      "service": { "label": "Which service do you need to optimize?" }
    },
    "serviceOptions": [
      "Transfers & Mobility",
      "Travel Management (Tickets/Hotel)",
      "Events & MICE Logistics",
      "Full Review (Everything)"
    ],
    "submit": "Request a Sales Contact",
    "demoAlert": "This is a demo. Email delivery will be connected here."
  },
  "footer": {
    "brand": "Tour Aventuras Pty",
    "brandSuffix": "| Corporate",
    "logoAlt": "Tour Aventuras PTY",
    "location": "Panama City, Panama"
  },
  "tourism": {
    "logoAlt": "Tour Aventuras Pty",
    "brand": "Tour Aventuras Pty",
    "hero": {
      "badge": "Tourism in Panama",
      "title": { "before": "Discover Panama with ", "highlight": "Tour Aventuras Pty" },
      "subtitle": "We are known for bringing out the cultural, natural and historical beauty of our country, turning every visit into a blend of feelings and experiences our guests carry home with them.",
      "ctaWhatsapp": "Ask us on WhatsApp",
      "ctaTours": "See all tours"
    },
    "stats": {
      "daily": "Daily service",
      "maxPassengers": "Max. passengers",
      "toursAvailable": "Tours available",
      "professionalGuides": "Professional guides"
    },
    "sections": {
      "cityTours": {
        "label": "City Tours",
        "title": "Discover Panama City",
        "description": "Daytime and nighttime tours through the capital's most iconic corners."
      },
      "ecoTours": {
        "label": "Ecotourism & Nature",
        "title": "Experience Panama's wild side",
        "description": "Rainforest, rivers, island paradises and the Panama Canal in a single experience."
      },
      "shopping": {
        "label": "Shopping",
        "title": "Colón Free Zone",
        "description": "The second-largest free trade zone in the world, in the Western Hemisphere."
      }
    },
    "includesLabel": "Includes",
    "tours": {
      "city_tour": {
        "name": "Panama City Tour",
        "duration": "4–6 hours",
        "description": "Spend half a day with us exploring the history and the modern life of a city shaped by so many cultures, old and new.",
        "includes": [
          "A/C transport + water and snacks",
          "Modern city: Cinta Costera, Balboa Theater, Canal Administration Building",
          "Casco Antiguo, the old quarter: Metropolitan Cathedral, Golden Altar Church, Puente de los Enamorados",
          "Panama Canal and Canal Museum",
          "Amador Duty Free (Causeway) and Albrook Mall",
          "Guide"
        ],
        "note": null
      },
      "city_tour_night": {
        "name": "Panama City Night Tour",
        "duration": "Evening",
        "description": "Discover a magical spot by the sea where you can take in the Panama City skyline on a warm, history-filled night.",
        "includes": ["Transport", "Walk through Casco Antiguo", "Amador Causeway", "Guide"],
        "note": null
      },
      "nightlife": {
        "name": "Night Tour — Nightlife",
        "duration": "Evening",
        "description": "One of the most popular destinations for locals and visitors alike in Panama City, thanks to its variety of food, drinks of every style and nightclubs.",
        "includes": [
          "One-way transfer to Casco Antiguo",
          "Visit to 7 bars",
          "6 cocktails included",
          "Nachos starter"
        ],
        "note": null
      },
      "gamboa": {
        "name": "Monkey Island — Gamboa",
        "duration": "Half day",
        "description": "Head out onto the waters of Gatún Lake by boat and discover Panama's astonishing biodiversity. Spot monkeys, sloths, caimans and hundreds of tropical birds in their natural habitat while navigating the highest point of the Panama Canal.",
        "includes": [
          "A/C ground transport",
          "Boat ride across Gatún Lake",
          "Monkey, sloth and tropical bird watching",
          "Fresh fruit and water",
          "Naturalist guide"
        ],
        "note": null
      },
      "san_blas": {
        "name": "San Blas",
        "duration": "Full day",
        "description": "Time stands still in the heartland of Guna culture, a place of white sand and crystal-clear water. Visit 3 islands: Isla Perro Chico, Isla Wailidub and the Natural Pools.",
        "includes": [
          "Lunch and drinks",
          "Ground transport",
          "Boat transport",
          "Comarca (indigenous territory) fees"
        ],
        "note": null
      },
      "embera": {
        "name": "Emberá — Indigenous Community",
        "duration": "6–8 hours",
        "description": "Take in the biodiversity as you travel up the Chagres River, and share in the roots and traditions of the Emberá indigenous community.",
        "includes": [
          "Ground transport",
          "Motorized dugout canoe ride",
          "Traditional Emberá lunch",
          "Fruit snack",
          "Waterfall visit (weather permitting)"
        ],
        "note": "Minimum 2 people"
      },
      "transito": {
        "name": "Partial Transit — Panama Canal",
        "duration": "6–8 hours",
        "description": "Experience the Panama Canal aboard a ferry along its historic waterway. Take in this engineering marvel and see how it works.",
        "includes": [
          "Hotel–port transport (round trip)",
          "Guide",
          "Breakfast and lunch",
          "Snacks"
        ],
        "note": null
      },
      "zona_libre": {
        "name": "Colón Free Zone",
        "duration": "Full day",
        "description": "Considered the second-largest free trade zone in the world and the first in the Western Hemisphere. Famous for unlimited, tax-free shopping: electronics, liquor, furniture, clothing, shoes, jewelry, watches and perfumes from the most renowned brands.",
        "includes": [
          "Round-trip transfer to the Colón Free Zone",
          "Guide",
          "Bottle of water"
        ],
        "note": null
      }
    },
    "cta": {
      "title": "Ready to live the experience?",
      "subtitle": "Get in touch and we'll design the perfect itinerary for you or your group, with no hidden costs.",
      "emailLabel": "Email",
      "book": "Book my tour now",
      "corporateQuestion": "Are you a business?",
      "corporateLink": "See corporate solutions →"
    },
    "footer": { "location": "Panama City" }
  }
}
```

- [ ] **Step 2: Wire `en` into the loader**

In `i18n/dictionaries.ts`, add the import and replace the placeholder entry:

```ts
import es from "./dictionaries/es.json";
import en from "./dictionaries/en.json";
```

```ts
const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
};
```

- [ ] **Step 3: Verify the type guard actually works**

Run: `npx tsc --noEmit`
Expected: no errors.

Then prove the guard is real — temporarily delete the `"ctaPrimary"` line from `en.json` and run `npx tsc --noEmit` again.
Expected: an error on the `en,` property in `i18n/dictionaries.ts` saying `hero.ctaPrimary` is missing.
Restore the line and confirm `npx tsc --noEmit` is clean again. **Do not commit the deletion.**

- [ ] **Step 4: Commit**

```bash
git add i18n/dictionaries/en.json i18n/dictionaries.ts
git commit -m "feat(i18n): add English dictionary, type-checked against Spanish"
```

---

### Task 3: Route restructure and proxy

Moves the routes under `app/[lang]/` and adds the proxy. Components still render hardcoded Spanish after this task — `/en` will show the Spanish copy. That is the expected intermediate state; the point of this task is that **routing** works in isolation before translation is layered on.

**Files:**
- Create: `app/[lang]/layout.tsx` (from `app/layout.tsx`)
- Create: `app/[lang]/page.tsx` (from `app/page.tsx`)
- Create: `app/[lang]/turismo/page.tsx` (from `app/turismo/page.tsx`)
- Create: `app/[lang]/not-found.tsx`
- Create: `proxy.ts`
- Delete: `app/layout.tsx`, `app/page.tsx`, `app/turismo/page.tsx`

**Interfaces:**
- Consumes: `locales`, `defaultLocale`, `htmlLang`, `Locale` (Task 1); `hasLocale` (Task 1).
- Produces: routes `/`, `/turismo`, `/en`, `/en/turismo`; `params.lang` typed via `LayoutProps<'/[lang]'>` and `PageProps<'/[lang]'>`.

- [ ] **Step 1: Move the files with `git mv` so history follows**

```bash
mkdir -p "app/[lang]/turismo"
git mv app/layout.tsx "app/[lang]/layout.tsx"
git mv app/page.tsx "app/[lang]/page.tsx"
git mv app/turismo/page.tsx "app/[lang]/turismo/page.tsx"
rmdir app/turismo
```

`app/globals.css`, `app/icon.svg` and `app/favicon.ico` stay where they are. They sit on the root segment, which still applies to every route below it.

- [ ] **Step 2: Fix the import paths broken by the move**

In `app/[lang]/layout.tsx`, the stylesheet import moves up one level:

```ts
import "../globals.css";
```

In `app/[lang]/turismo/page.tsx`, replace the relative imports with the `@/` alias — they are now two directories deeper and would otherwise silently resolve wrong:

```ts
import ModeToggle from "@/components/ModeToggle";
import embera from "@/public/embera/embera.jpg";
import sanblas from "@/public/san_blass/san_blass.jpg";
import gamboa from "@/public/gamboa/gamboa.jpg";
import transito from "@/public/transito/transito.jpeg";
import zonafree from "@/public/zona_libre/zona_free.jpg";
import cityTour from "@/public/city_tour/city_tour.jpg";
```

- [ ] **Step 3: Make the layout locale-aware**

Replace the `RootLayout` export at the bottom of `app/[lang]/layout.tsx` (keep the existing `inter` font setup and the `metadata` export untouched for now — Task 7 replaces the metadata):

```tsx
import { notFound } from "next/navigation";
import { htmlLang, locales } from "@/i18n/config";
import { hasLocale } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={htmlLang[lang]} className={inter.variable}>
      <body className="bg-gray-50 text-gray-800 antialiased">{children}</body>
    </html>
  );
}
```

`LayoutProps` is a global type helper in Next.js 16 — do not import it.

- [ ] **Step 4: Create `app/[lang]/not-found.tsx`**

The root layout now lives inside `[lang]`, so the 404 page must live there too.

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-extrabold text-corporate-900">404</p>
      <Link href="/" className="text-corporate-500 font-semibold hover:underline">
        Tour Aventuras PTY
      </Link>
    </main>
  );
}
```

This page is intentionally locale-neutral: it is reachable for an unknown `lang` value, where no dictionary exists to render from.

- [ ] **Step 5: Create `proxy.ts` at the project root**

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The file sits at the repo root, next to `app/`.

```ts
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The default locale is served from the root, so /es/* is a duplicate of /*.
  // Redirect it permanently rather than letting both URLs resolve.
  if (
    pathname === `/${defaultLocale}` ||
    pathname.startsWith(`/${defaultLocale}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 301);
  }

  // A path that already carries a supported locale is served as-is.
  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  // Everything else is Spanish. Rewrite (not redirect) so the clean URL stays
  // in the address bar and in Google's index.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes and anything with a file extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
```

- [ ] **Step 6: Build and verify all four routes prerender**

Run: `npm run build`
Expected: success, and the route table lists `/[lang]` and `/[lang]/turismo` as prerendered with both `es` and `en` params (4 static pages).

- [ ] **Step 7: Verify routing behaviour against a running server**

Run: `npm run build && npm run start` in one terminal, then in another:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/turismo
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/en
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/en/turismo
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/es
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/es/turismo
curl -s http://localhost:3000/en | grep -o '<html lang="[^"]*"'
curl -s http://localhost:3000/ | grep -o '<html lang="[^"]*"'
```

Expected:
- `/`, `/turismo`, `/en`, `/en/turismo` → `200`
- `/es` → `301` to `http://localhost:3000/`
- `/es/turismo` → `301` to `http://localhost:3000/turismo`
- `<html lang="en">` on `/en`, `<html lang="es-PA">` on `/`

Stop the server when done.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(i18n): move routes under [lang] and add locale proxy"
```

---

### Task 4: Language switcher, navbar and mode toggle

The first task that produces visible behaviour: a working ES/EN control.

**Files:**
- Create: `components/LanguageSwitcher.tsx`
- Modify: `components/ModeToggle.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `app/[lang]/page.tsx` (pass props into `Navbar`)

**Interfaces:**
- Consumes: `stripLocale`, `localizedPath`, `locales`, `Locale` (Task 1); `getDictionary` (Task 1).
- Produces:
  - `<LanguageSwitcher ariaLabel={string} className?={string} />`
  - `<ModeToggle t={Dictionary["modeToggle"]} lang={Locale} className?={string} />`
  - `<Navbar t={Dictionary["nav"]} modeToggle={Dictionary["modeToggle"]} languageSwitcher={Dictionary["languageSwitcher"]} lang={Locale} />`

- [ ] **Step 1: Create `components/LanguageSwitcher.tsx`**

Two real `<Link>` elements, not a `router.push`. The crawler follows links — this is how Google discovers the English side of the site.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath, locales, stripLocale } from "@/i18n/config";

const labels = { es: "ES", en: "EN" } as const;

export default function LanguageSwitcher({
  ariaLabel,
  className = "",
}: {
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const { locale: current, path } = stripLocale(pathname);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-gray-200 p-0.5 ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={localizedPath(path, locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
              active
                ? "bg-corporate-900 text-white"
                : "text-gray-500 hover:text-corporate-900"
            }`}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
```

Note `usePathname()` returns the **rewritten-from** URL as the browser sees it (`/turismo`, not `/es/turismo`), which is exactly what `stripLocale` expects.

- [ ] **Step 2: Make `ModeToggle` locale-aware**

Its two links must stay in the current language, otherwise switching from `/en/turismo` to Corporate would drop the visitor back into Spanish. Replace the whole file:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath, stripLocale, type Locale } from "@/i18n/config";

export default function ModeToggle({
  t,
  lang,
  className = "",
}: {
  t: { corporate: string; tourism: string; ariaLabel: string };
  lang: Locale;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const { path } = stripLocale(pathname);
  const isTurismo = path.startsWith("/turismo");

  const segments = [
    { path: "/", label: t.corporate, active: !isTurismo },
    { path: "/turismo", label: t.tourism, active: isTurismo },
  ];

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-corporate-900 p-1 ${className}`}
      role="group"
      aria-label={t.ariaLabel}
    >
      {segments.map((seg) => (
        <Link
          key={seg.path}
          href={localizedPath(seg.path, lang)}
          aria-current={seg.active ? "page" : undefined}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
            seg.active
              ? "bg-corporate-500 text-white shadow-sm"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {seg.label}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Convert `Navbar` to props and add the switcher**

In `components/Navbar.tsx`:

Replace the module-level `navLinks` constant and the component signature. The links array must be built inside the component now, because the labels come from props:

```tsx
import LanguageSwitcher from "./LanguageSwitcher";
import { type Locale } from "@/i18n/config";

type NavbarDict = {
  brand: string;
  brandSuffix: string;
  brandShort: string;
  logoAlt: string;
  links: { services: string; philosophy: string };
  cta: string;
  openMenu: string;
  closeMenu: string;
  location: string;
};

export default function Navbar({
  t,
  modeToggle,
  languageSwitcher,
  lang,
}: {
  t: NavbarDict;
  modeToggle: { corporate: string; tourism: string; ariaLabel: string };
  languageSwitcher: { ariaLabel: string };
  lang: Locale;
}) {
  const [open, setOpen] = useState(false);

  const navLinks: NavLink[] = [
    { href: "#servicios", label: t.links.services, icon: <FaCarSide /> },
    { href: "#filosofia", label: t.links.philosophy, icon: <FaBuilding /> },
  ];
  // ...rest of the component unchanged apart from the substitutions below
```

Then substitute, leaving every className untouched:

| Current literal | Replace with |
|---|---|
| `alt="Tour Aventuras PTY"` (desktop logo) | `alt={t.logoAlt}` |
| `Tour Aventuras` (desktop brand) | `{t.brand}` |
| `\| Corporativo` | `{t.brandSuffix}` |
| `Agendar Reunión` (both desktop and drawer CTA) | `{t.cta}` |
| `aria-label="Abrir menú"` | `aria-label={t.openMenu}` |
| `aria-label="Cerrar menú"` | `aria-label={t.closeMenu}` |
| `alt="Tour Aventuras PTY"` (drawer logo) | `alt={t.logoAlt}` |
| `Tour Aventuras Pty` (drawer brand) | `{t.brandShort}` |
| `Ciudad de Panamá, Panamá` | `{t.location}` |

Both `<ModeToggle />` usages (desktop, line ~68; drawer, line ~150) become:

```tsx
<ModeToggle t={modeToggle} lang={lang} />
```

Add the switcher next to each. Desktop — immediately before `<ModeToggle .../>` in the `hidden md:flex` block:

```tsx
<LanguageSwitcher ariaLabel={languageSwitcher.ariaLabel} />
```

Drawer — inside the `flex justify-center mb-4` wrapper, after `<ModeToggle .../>`:

```tsx
<LanguageSwitcher ariaLabel={languageSwitcher.ariaLabel} className="ml-2" />
```

- [ ] **Step 4: Feed the props from the page**

In `app/[lang]/page.tsx`, replace the whole file. Every other section keeps its current no-prop call for now — Task 5 converts them.

```tsx
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import ServicesSection from "@/components/ServicesSection";
import PhilosophySection from "@/components/PhilosophySection";
import AIPlannerSection from "@/components/AIPlannerSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Navbar
        t={t.nav}
        modeToggle={t.modeToggle}
        languageSwitcher={t.languageSwitcher}
        lang={lang}
      />
      <main>
        <HeroSection />
        <ClientsSection />
        <ServicesSection />
        <PhilosophySection />
        <AIPlannerSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Fix the other `ModeToggle` caller**

`app/[lang]/turismo/page.tsx` renders `<ModeToggle />` in its header and will no longer compile. Give it the dictionary there:

```tsx
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

export default async function TurismoPage({ params }: PageProps<'/[lang]/turismo'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const whatsapp = "https://wa.me/50765889209";
  // ...
```

and in the header:

```tsx
<ModeToggle t={t.modeToggle} lang={lang} />
```

The rest of the tourism page stays hardcoded Spanish until Task 6.

- [ ] **Step 6: Build and verify**

Run: `npm run build && npm run lint`
Expected: both clean.

- [ ] **Step 7: Verify the switcher behaviour in the browser**

Run `npm run start`, then check by hand:
- `/` shows the navbar with an `ES | EN` control, `ES` highlighted.
- Clicking `EN` navigates to `/en` — **not** to `/en/` or `/`.
- On `/turismo`, clicking `EN` lands on `/en/turismo`, the same page.
- On `/en/turismo`, clicking `Corporativo`/`Corporate` in the mode toggle lands on `/en`, staying in English.
- The mobile drawer (narrow the window below 768px) shows both controls.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(i18n): add language switcher, localize navbar and mode toggle"
```

---

### Task 5: Localize the corporate home sections

**Files:**
- Modify: `components/HeroSection.tsx`, `components/ClientsSection.tsx`, `components/ServicesSection.tsx`, `components/PhilosophySection.tsx`, `components/AIPlannerSection.tsx`, `components/ContactSection.tsx`, `components/Footer.tsx`
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `Dictionary` slices from Task 1/2.
- Produces: each component takes a single `t` prop holding its own slice. Signatures: `HeroSection({ t }: { t: Dictionary["hero"] })`, and the same shape for `ClientsSection`/`clients`, `ServicesSection`/`services`, `PhilosophySection`/`philosophy`, `AIPlannerSection`/`planner`, `ContactSection`/`contact`, `Footer`/`footer`.

Each component keeps every className, icon, layout and `id` exactly as it is. Only the text nodes and text-bearing attributes change.

- [ ] **Step 1: `HeroSection`**

```tsx
export default function HeroSection({ t }: { t: Dictionary["hero"] }) {
```

Substitutions:
- badge text `División B2B Logística` → `{t.badge}`
- the `<h1>` contents become:

```tsx
{t.title.before}
<span className="text-transparent bg-clip-text bg-linear-to-r from-corporate-400 to-accent-500">
  {t.title.highlight}
</span>
{t.title.after}
```

(the existing `{" "}` separators are dropped — the leading/trailing spaces now live inside the dictionary strings)
- paragraph → `{t.subtitle}`
- `Optimizar Mis Costos` → `{t.ctaPrimary}`
- `Nuestro Portafolio` → `{t.ctaSecondary}`

The commented-out `<Link href="/turismo">` block at the bottom is dead code and stays commented; do not translate or revive it.

`import type { Dictionary } from "@/i18n/dictionaries";` goes at the top of each of these components.

- [ ] **Step 2: `ClientsSection`**

```tsx
export default function ClientsSection({ t }: { t: Dictionary["clients"] }) {
```

Only the `<p>` changes → `{t.title}`. The six client logos are brand names and stay hardcoded.

- [ ] **Step 3: `ServicesSection`**

```tsx
export default function ServicesSection({ t }: { t: Dictionary["services"] }) {
```

The three cards are currently copy-pasted markup. Replace the three hardcoded card blocks with a single mapped render, which is also what makes them translatable without triplicating the substitutions:

```tsx
const cards = [
  { key: "mobility" as const, icon: <FaCarSide />, badge: false },
  { key: "travel" as const, icon: <FaPlaneDeparture />, badge: true },
  { key: "mice" as const, icon: <FaUserGear />, badge: false },
];
```

```tsx
<div className="grid md:grid-cols-3 gap-8">
  {cards.map(({ key, icon, badge }) => {
    const item = t.items[key];
    return (
      <div
        key={key}
        className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group${
          badge ? " relative overflow-hidden" : ""
        }`}
      >
        {badge && (
          <div className="absolute top-0 right-0 bg-corporate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            {t.badge}
          </div>
        )}
        <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl mb-6 group-hover:bg-corporate-500 group-hover:text-white transition">
          {icon}
        </div>
        <h4 className="text-xl font-bold text-corporate-900 mb-3">{item.title}</h4>
        <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
        <ul className="text-sm text-gray-500 space-y-2">
          {item.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <FaCheck className="text-accent-500 shrink-0" /> {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  })}
</div>
```

Header substitutions: `Nuestro Portafolio` → `{t.eyebrow}`, the `<h3>` → `{t.title}`, the `<p>` → `{t.subtitle}`.

- [ ] **Step 4: `PhilosophySection`**

```tsx
export default function PhilosophySection({ t }: { t: Dictionary["philosophy"] }) {
```

- `alt="Ejecutivos en Panamá"` → `alt={t.imageAlt}`
- `<h2>` → `{t.title.before}<span className="text-corporate-500">{t.title.highlight}</span>` (drop the `{" "}`)
- intro `<p>` → `{t.intro}`
- Replace the three hand-written pillar blocks with a map:

```tsx
const pillars = [
  { key: "logistics" as const, icon: <FaRoute /> },
  { key: "management" as const, icon: <FaFileInvoiceDollar /> },
  { key: "support" as const, icon: <FaHeadset /> },
];
```

```tsx
<div className="space-y-6">
  {pillars.map(({ key, icon }) => (
    <div key={key} className="flex gap-4">
      <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
        {icon}
      </div>
      <div>
        <h5 className="text-xl font-bold text-corporate-900">
          {t.pillars[key].title}
        </h5>
        <p className="text-gray-600">{t.pillars[key].description}</p>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 5: `AIPlannerSection`**

Still `"use client"`; it now takes a prop.

```tsx
export default function AIPlannerSection({ t }: { t: Dictionary["planner"] }) {
```

`Consulta Directa` → `{t.badge}`; `<h2>` → `{t.title}`; the `<p>` → `{t.subtitle}`; the `<label>` → `{t.label}`; `placeholder="Tenemos una delegación de..."` → `placeholder={t.placeholder}`; the button text → `{t.button}`. `WHATSAPP_NUMBER` is unchanged.

- [ ] **Step 6: `ContactSection`**

Still `"use client"`.

```tsx
export default function ContactSection({ t }: { t: Dictionary["contact"] }) {
```

- `<h2>` → `{t.title}`, subtitle `<p>` → `{t.subtitle}`
- name field: label `{t.fields.name.label}`, `placeholder={t.fields.name.placeholder}`
- company field: label `{t.fields.company.label}`, `placeholder={t.fields.company.placeholder}`
- email field: label `{t.fields.email.label}`, `placeholder={t.fields.email.placeholder}`
- select label → `{t.fields.service.label}`, and the four `<option>`s become:

```tsx
{t.serviceOptions.map((option) => (
  <option key={option}>{option}</option>
))}
```

- submit button text → `{t.submit}`, and `alert("Esta es una demostración...")` → `alert(t.demoAlert)`

- [ ] **Step 7: `Footer`**

```tsx
export default function Footer({ t }: { t: Dictionary["footer"] }) {
```

- `alt="Tour Aventuras PTY"` → `alt={t.logoAlt}`
- `Tour Aventuras Pty` → `{t.brand}`, `| Corporate` → `{t.brandSuffix}`
- the contact line becomes:

```tsx
<div className="text-sm">
  {t.location} | contacto@touraventuraspty.com | +507 6588-9209
</div>
```

The `aria-label="LinkedIn"` / `aria-label="Instagram"` values are proper nouns and stay.

- [ ] **Step 8: Pass every slice from the page**

In `app/[lang]/page.tsx`:

```tsx
      <main>
        <HeroSection t={t.hero} />
        <ClientsSection t={t.clients} />
        <ServicesSection t={t.services} />
        <PhilosophySection t={t.philosophy} />
        <AIPlannerSection t={t.planner} />
        <ContactSection t={t.contact} />
      </main>
      <Footer t={t.footer} />
```

- [ ] **Step 9: Build, lint, and confirm no Spanish is left in the components**

Run: `npm run build && npm run lint`
Expected: both clean.

Run: `grep -nE '[áéíóúñ¿¡]|Soluciones|Empresa|Traslados|Gestión' components/*.tsx`
Expected: no matches (the tourism page is Task 6 and is not in this glob).

- [ ] **Step 10: Verify in the browser**

Run `npm run start`, then load `/` and `/en`. Every section on `/en` must be English; every section on `/` must read exactly as it did before this plan started. To compare against the pre-i18n original, find the commit with `git log --oneline -1 --before=2026-09-14 -- components/HeroSection.tsx` and `git show <sha>:components/HeroSection.tsx`.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(i18n): localize corporate home sections"
```

---

### Task 6: Localize the tourism page

**Files:**
- Modify: `app/[lang]/turismo/page.tsx`

**Interfaces:**
- Consumes: `Dictionary["tourism"]`, `Dictionary["modeToggle"]`, `getDictionary`, `hasLocale`, `Locale`.
- Produces: nothing consumed by later tasks.

The page currently holds the tour data in three module-level constants (`cityTours`, `ecoTours`, `shoppingTour`). Content moves to the dictionary; the image for each tour stays here, keyed by the same id.

- [ ] **Step 1: Replace the three data constants with an image map**

Delete `cityTours`, `ecoTours` and `shoppingTour` entirely. In their place:

```tsx
import type { Dictionary } from "@/i18n/dictionaries";

type TourId = keyof Dictionary["tourism"]["tours"];

const tourImages: Record<TourId, string | StaticImageData> = {
  city_tour: cityTour,
  city_tour_night: "/city_tour_night.jpeg",
  nightlife:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
  gamboa: gamboa,
  san_blas: sanblas,
  embera: embera,
  transito: transito,
  zona_libre: zonafree,
};

const cityTourIds: TourId[] = ["city_tour", "city_tour_night", "nightlife"];
const ecoTourIds: TourId[] = ["gamboa", "san_blas", "embera", "transito"];
```

Keeping `tourImages` typed as `Record<TourId, ...>` means adding a tour to the dictionary without an image is a build error.

- [ ] **Step 2: Rework `TourCard` to take an id plus the dictionary**

```tsx
function TourCard({
  tour,
  image,
  includesLabel,
  icon,
}: {
  tour: Dictionary["tourism"]["tours"][TourId];
  image: string | StaticImageData;
  includesLabel: string;
  icon: React.ReactNode;
}) {
```

Inside, replace `tour.image` with the `image` prop in both the `{tour.image && (` guard and the `src=` expression, and replace the hardcoded `Incluye` heading with `{includesLabel}`. Everything else in the component — classNames, the `FaClock` duration pill, the `includes` map, the `note` pill — stays exactly as written.

- [ ] **Step 3: Render the sections from the dictionary**

`SectionHeader` already takes `label`/`title`/`description` as props and needs no change. Update its three call sites:

```tsx
<SectionHeader
  icon={<FaCity />}
  label={t.tourism.sections.cityTours.label}
  title={t.tourism.sections.cityTours.title}
  description={t.tourism.sections.cityTours.description}
/>
```

and the same shape for `ecoTours` (icon `<FaLeaf />`) and `shopping` (icon `<FaShip />`).

The two card grids become:

```tsx
{cityTourIds.map((id) => (
  <TourCard
    key={id}
    tour={t.tourism.tours[id]}
    image={tourImages[id]}
    includesLabel={t.tourism.includesLabel}
    icon={<FaCity />}
  />
))}
```

```tsx
{ecoTourIds.map((id) => (
  <TourCard
    key={id}
    tour={t.tourism.tours[id]}
    image={tourImages[id]}
    includesLabel={t.tourism.includesLabel}
    icon={<FaLeaf />}
  />
))}
```

In the featured Zona Libre block, replace `shoppingTour.image.src` with `tourImages.zona_libre` (it is a `StaticImageData`, so `src` still applies: use `(tourImages.zona_libre as StaticImageData).src`), `shoppingTour.name` with `t.tourism.tours.zona_libre.name`, `shoppingTour.duration` with `.duration`, `shoppingTour.description` with `.description`, the `Incluye` heading with `{t.tourism.includesLabel}`, and the `shoppingTour.includes` map with `t.tourism.tours.zona_libre.includes`.

- [ ] **Step 4: Substitute the remaining page copy**

| Current literal | Replace with |
|---|---|
| `alt="Tour Aventuras Pty"` (header logo) | `alt={t.tourism.logoAlt}` |
| `Tour Aventuras Pty` (header brand) | `{t.tourism.brand}` |
| `Turismo en Panamá` | `{t.tourism.hero.badge}` |
| `Descubre Panamá con ` + gradient span | `{t.tourism.hero.title.before}` + `{t.tourism.hero.title.highlight}` in the span |
| hero paragraph | `{t.tourism.hero.subtitle}` |
| `Consultar por WhatsApp` | `{t.tourism.hero.ctaWhatsapp}` |
| `Ver todos los tours` | `{t.tourism.hero.ctaTours}` |
| `¿Listo para vivir la experiencia?` | `{t.tourism.cta.title}` |
| CTA paragraph | `{t.tourism.cta.subtitle}` |
| `Correo` | `{t.tourism.cta.emailLabel}` |
| `Reservar mi tour ahora` | `{t.tourism.cta.book}` |
| `¿Eres empresa?` | `{t.tourism.cta.corporateQuestion}` |
| `Ver soluciones corporativas →` | `{t.tourism.cta.corporateLink}` |
| `Ciudad de Panamá` (footer) | `{t.tourism.footer.location}` |

The stats strip keeps its numeric values in the TSX and takes its labels from the dictionary:

```tsx
{[
  { value: "24/7", label: t.tourism.stats.daily },
  { value: "150", label: t.tourism.stats.maxPassengers },
  { value: "8+", label: t.tourism.stats.toursAvailable },
  { value: "100%", label: t.tourism.stats.professionalGuides },
].map((s) => (
```

The `WhatsApp` and `Instagram` sub-labels under the contact cards are proper nouns and stay. `@Tour_aventuras`, the phone number and the email address stay.

- [ ] **Step 5: Keep the corporate back-link in the current language**

The footer link `<Link href="/">` must become:

```tsx
<Link href={localizedPath("/", lang)} className="text-corporate-400 hover:text-white transition underline">
```

with `import { localizedPath } from "@/i18n/config";` at the top. Otherwise an English visitor clicking it lands on the Spanish homepage.

- [ ] **Step 6: Build, lint, and confirm no Spanish is left**

Run: `npm run build && npm run lint`
Expected: both clean.

Run: `grep -nE 'Incluye|Ciudad de Panamá|Descubre|Reservar|Consultar|¿' "app/[lang]/turismo/page.tsx"`
Expected: no matches.

- [ ] **Step 7: Verify in the browser**

Run `npm run start`, then compare `/turismo` and `/en/turismo` side by side. All eight tours must appear in both, with the same images, in the same order, and the English page must contain no Spanish outside the proper nouns listed in the Global Constraints.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(i18n): localize tourism page and move tour content into dictionaries"
```

---

### Task 7: SEO metadata, hreflang, sitemap and robots

**Files:**
- Modify: `app/[lang]/layout.tsx`
- Modify: `app/[lang]/page.tsx`
- Modify: `app/[lang]/turismo/page.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `siteUrl`, `alternatesFor` (Task 1); `ogLocale`, `localizedPath`, `locales` (Task 1); `getDictionary` (Task 1).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Replace the static `metadata` export in the layout with `generateMetadata`**

Delete the whole `export const metadata: Metadata = { ... }` block from `app/[lang]/layout.tsx` and the now-unused `siteUrl` / `siteTitle` / `siteDescription` constants. Add:

```tsx
import { siteUrl } from "@/i18n/seo";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: t.meta.home.title,
    description: t.meta.home.description,
    icons: { icon: { url: "/logo_final_icon.svg", type: "image/svg+xml" } },
  };
}
```

The layout supplies `metadataBase` and the icons; each page overrides title, description and alternates.

- [ ] **Step 2: Add `generateMetadata` to the home page**

At the top of `app/[lang]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ogLocale } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: alternatesFor("/", lang),
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: ogLocale[lang === "es" ? "en" : "es"],
      url: alternatesFor("/", lang).canonical,
      siteName: t.meta.siteName,
      title: t.meta.home.title,
      description: t.meta.home.description,
      images: [
        {
          url: "/logo_final_icon.png",
          width: 1200,
          height: 1200,
          alt: t.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t.meta.home.title,
      description: t.meta.home.description,
      images: ["/logo_final_icon.png"],
    },
  };
}
```

- [ ] **Step 3: Add `generateMetadata` to the tourism page**

The tourism page has **no metadata at all** today — it inherits the corporate title, which is wrong for both languages. Add to `app/[lang]/turismo/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ogLocale } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/turismo'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    title: t.meta.turismo.title,
    description: t.meta.turismo.description,
    alternates: alternatesFor("/turismo", lang),
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: ogLocale[lang === "es" ? "en" : "es"],
      url: alternatesFor("/turismo", lang).canonical,
      siteName: t.meta.siteName,
      title: t.meta.turismo.title,
      description: t.meta.turismo.description,
      images: [
        {
          url: "/logo_final_icon.png",
          width: 1200,
          height: 1200,
          alt: t.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t.meta.turismo.title,
      description: t.meta.turismo.description,
      images: ["/logo_final_icon.png"],
    },
  };
}
```

- [ ] **Step 4: Create `app/sitemap.ts`**

```ts
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
```

`lastModified` is deliberately omitted: a build-time `new Date()` would claim every page changed on every deploy, which is worse than no signal.

- [ ] **Step 5: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/i18n/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: Confirm the proxy does not swallow `/sitemap.xml` or `/robots.txt`**

Both contain a dot, so the `.*\\..*` clause in the matcher already excludes them. Verify rather than assume — this is checked in Step 8.

- [ ] **Step 7: Build**

Run: `npm run build && npm run lint`
Expected: both clean, and the route table lists `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 8: Verify the SEO output on a running server**

Run `npm run start`, then:

```bash
for u in / /turismo /en /en/turismo; do
  echo "--- $u"
  curl -s "http://localhost:3000$u" | grep -oE '<link rel="(canonical|alternate)"[^>]*>|<html lang="[^"]*"|<title>[^<]*</title>'
done
curl -s http://localhost:3000/sitemap.xml | head -40
curl -s http://localhost:3000/robots.txt
```

Expected, on each of the four pages:
- `<html lang>` is `es-PA` or `en` to match the URL
- exactly one `rel="canonical"` pointing at the page's own URL (`/turismo` for Spanish, `/en/turismo` for English — never `/es/...`)
- three `rel="alternate"` links: `hreflang="es-PA"`, `hreflang="en"`, `hreflang="x-default"`, with identical values on all four pages for a given route
- `<title>` in the page's own language, and the tourism pages must **not** show the corporate title
- `sitemap.xml` lists four `<url>` entries with `xhtml:link` alternates
- `robots.txt` names `https://www.touraventuraspty.com/sitemap.xml`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(seo): per-locale metadata, hreflang cluster, sitemap and robots"
```

---

### Task 8: Final verification and spec reconciliation

**Files:**
- Modify: `docs/superpowers/specs/2026-09-14-i18n-language-switcher-design.md`

- [ ] **Step 1: Confirm no dependency was added**

Run: `git log --oneline -1 -- package.json package-lock.json`
Expected: a commit that predates this plan — none of the commits made by Tasks 1–7 may appear.

- [ ] **Step 2: Confirm the dictionary never reached the client bundle**

Run: `grep -rl "Zona Libre de Colón" .next/static/chunks/ 2>/dev/null`
Expected: no output. If any chunk matches, a Client Component is importing `@/i18n/dictionaries` directly — find it and pass props instead.

- [ ] **Step 3: Run the full verification suite from the spec**

```bash
npm run build && npm run lint && npm run start
```

Then walk all four URLs in a browser: copy renders in the right language, the switcher preserves the current page, the mode toggle preserves the language, and the mobile drawer works at <768px.

- [ ] **Step 4: Reconcile the spec with what was built**

The spec's `i18n/dictionaries.ts` sketch shows an async loader with dynamic imports. The implementation is synchronous with static imports, because that is what makes `Record<Locale, Dictionary>` catch a missing key at build time, and because all four pages are prerendered so there is nothing to code-split. Update the spec's *Dictionaries* section code block to match `i18n/dictionaries.ts` as built, and add a sentence recording why.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-09-14-i18n-language-switcher-design.md
git commit -m "docs: reconcile i18n spec with the implemented dictionary loader"
```

---

## Self-Review

**Spec coverage** — every section of the spec maps to a task:

| Spec section | Task |
|---|---|
| File layout | 1, 3, 7 |
| Routing (proxy table, rewrite/redirect) | 3 |
| Dictionaries (config, loader, type guarantee) | 1, 2 |
| Dictionary shape (key tree, split headlines, tour ids) | 1, 6 |
| Components (presentational, props not imports) | 4, 5, 6 |
| Language switcher (real `<Link>`s, placement) | 4 |
| SEO (generateMetadata, hreflang, sitemap, robots, static params) | 3 (static params), 7 |
| Translation approach (rules, proper nouns, durations) | 2 |
| Error handling (`hasLocale` → `notFound`, 404 page, build-time key check) | 2, 3 |
| Verification (build, lint, 4 URLs, view-source, `curl -I` on `/es`) | 3, 5, 6, 7, 8 |

**Type consistency** — `getDictionary` is synchronous in every call site across Tasks 3–7. `Dictionary` slices are referenced as `Dictionary["hero"]`, `Dictionary["tourism"]["tours"][TourId]` etc., all derived from the `es.json` shape defined in Task 1. `localizedPath` / `stripLocale` signatures are used identically in Tasks 4 and 6. `alternatesFor(path, locale)` is called with the same two arguments in Tasks 7 Steps 2–4.

**Known intermediate states** — after Task 3, `/en` renders Spanish copy; after Task 4, the tourism page body is still Spanish. Both are called out in their tasks and resolved by Task 6.
