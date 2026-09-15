import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModeToggle from "@/components/ModeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/config";
import {
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaCheck,
  FaClock,
  FaUsers,
  FaCity,
  FaMoon,
  FaLeaf,
  FaShip,
  FaMapLocationDot,
} from "react-icons/fa6";
import embera from "@/public/embera/embera.jpg";
import sanblas from "@/public/san_blass/san_blass.jpg";
import gamboa from "@/public/gamboa/gamboa.jpg";
import transito from "@/public/transito/transito.jpeg";
import zonafree from "@/public/zona_libre/zona_free.jpg";
import cityTour from "@/public/city_tour/city_tour.jpg";

/* ─── Tour images (content lives in the dictionaries) ─── */

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

/* ─── Card components ─── */

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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group">
      {image && (
        <div className="h-48 overflow-hidden">
          <img
            src={typeof image === "string" ? image : image.src}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-7 flex flex-col flex-1">
        <div className="w-12 h-12 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-xl mb-5 group-hover:bg-corporate-500 group-hover:text-white transition">
          {icon}
        </div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-corporate-900 leading-snug">
            {tour.name}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-corporate-500 bg-corporate-50 px-2 py-1 rounded-full whitespace-nowrap">
            <FaClock className="text-[10px]" /> {tour.duration}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
          {tour.description}
        </p>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            {includesLabel}
          </p>
          <ul className="space-y-1.5">
            {tour.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <FaCheck className="text-accent-500 shrink-0 mt-0.5 text-xs" />
                {item}
              </li>
            ))}
          </ul>
          {tour.note && (
            <p className="mt-3 text-xs font-semibold text-corporate-500 bg-corporate-50 px-3 py-1.5 rounded-lg inline-block">
              {tour.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  title,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-corporate-100 text-corporate-500 text-sm font-semibold mb-4">
        {icon} {label}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-3">
        {title}
      </h2>
      <p className="text-gray-500 text-lg">{description}</p>
    </div>
  );
}

/* ─── Page ─── */

export default async function TurismoPage({ params }: PageProps<'/[lang]/turismo'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const whatsapp = "https://wa.me/50765889209";

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt={t.tourism.logoAlt}
              width={44}
              height={34}
              className="rounded-md"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-corporate-900 text-sm leading-tight block">
                {t.tourism.brand}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher ariaLabel={t.languageSwitcher.ariaLabel} />
            <ModeToggle t={t.modeToggle} lang={lang} />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="min-h-[60vh] flex items-center pt-0 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.88)), url('/panama_background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-corporate-400 text-sm font-semibold mb-6">
              <FaMapLocationDot /> {t.tourism.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              {t.tourism.hero.title.before}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-corporate-400 to-accent-500">
                {t.tourism.hero.title.highlight}
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
              {t.tourism.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:opacity-90 text-white px-7 py-3.5 rounded-md font-semibold text-base transition shadow-lg"
              >
                <FaWhatsapp className="text-lg" /> {t.tourism.hero.ctaWhatsapp}
              </a>
              <a
                href="#tours"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-md font-semibold text-base hover:bg-white/20 transition backdrop-blur-sm"
              >
                {t.tourism.hero.ctaTours}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick stats ── */}
      <section className="bg-corporate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "24/7", label: t.tourism.stats.daily },
              { value: "150", label: t.tourism.stats.maxPassengers },
              { value: "8+", label: t.tourism.stats.toursAvailable },
              { value: "100%", label: t.tourism.stats.professionalGuides },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-corporate-400">
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Tours ── */}
      <section id="tours" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={<FaCity />}
            label={t.tourism.sections.cityTours.label}
            title={t.tourism.sections.cityTours.title}
            description={t.tourism.sections.cityTours.description}
          />
          <div className="grid md:grid-cols-3 gap-7">
            {cityTourIds.map((id) => (
              <TourCard
                key={id}
                tour={t.tourism.tours[id]}
                image={tourImages[id]}
                includesLabel={t.tourism.includesLabel}
                icon={<FaCity />}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Ecoturismo ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={<FaLeaf />}
            label={t.tourism.sections.ecoTours.label}
            title={t.tourism.sections.ecoTours.title}
            description={t.tourism.sections.ecoTours.description}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {ecoTourIds.map((id) => (
              <TourCard
                key={id}
                tour={t.tourism.tours[id]}
                image={tourImages[id]}
                includesLabel={t.tourism.includesLabel}
                icon={<FaLeaf />}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Zona Libre (featured) ── */}
      <section className="py-20 bg-corporate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={<FaShip />}
            label={t.tourism.sections.shopping.label}
            title={t.tourism.sections.shopping.title}
            description={t.tourism.sections.shopping.description}
          />
          <div className="bg-white rounded-2xl shadow-sm border border-corporate-100 overflow-hidden">
            <div className="h-56 overflow-hidden">
              <img
                src={
                  typeof tourImages.zona_libre === "string"
                    ? tourImages.zona_libre
                    : tourImages.zona_libre.src
                }
                alt={t.tourism.tours.zona_libre.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl shrink-0">
                <FaShip />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-corporate-900">
                    {t.tourism.tours.zona_libre.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-corporate-500 bg-corporate-50 px-2 py-1 rounded-full">
                    <FaClock className="text-[10px]" />{" "}
                    {t.tourism.tours.zona_libre.duration}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.tourism.tours.zona_libre.description}
                </p>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    {t.tourism.includesLabel}
                  </p>
                  <ul className="flex flex-wrap gap-3">
                    {t.tourism.tours.zona_libre.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg"
                      >
                        <FaCheck className="text-accent-500 text-xs shrink-0" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section className="bg-corporate-900 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/cubes.png')",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.tourism.cta.title}
          </h2>
          <p className="text-corporate-400 text-lg mb-10 font-light max-w-xl mx-auto">
            {t.tourism.cta.subtitle}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-5 rounded-xl transition"
            >
              <FaWhatsapp className="text-2xl text-accent-500" />
              <span className="font-semibold text-sm">+507 6588-9209</span>
              <span className="text-xs text-gray-400">WhatsApp</span>
            </a>
            <a
              href="mailto:contacto@touraventuraspty.com"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-5 rounded-xl transition"
            >
              <FaEnvelope className="text-2xl text-corporate-400" />
              <span className="font-semibold text-xs truncate w-full text-center">
                contacto@touraventuraspty.com
              </span>
              <span className="text-xs text-gray-400">
                {t.tourism.cta.emailLabel}
              </span>
            </a>
            <a
              href="https://instagram.com/Tour_aventuras"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-5 rounded-xl transition"
            >
              <FaInstagram className="text-2xl text-pink-400" />
              <span className="font-semibold text-sm">@Tour_aventuras</span>
              <span className="text-xs text-gray-400">Instagram</span>
            </a>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent-500 hover:opacity-90 text-white px-8 py-4 rounded-md font-bold text-lg transition shadow-lg"
          >
            <FaWhatsapp className="text-xl" /> {t.tourism.cta.book}
          </a>

          <p className="mt-8 text-sm text-gray-500">
            {t.tourism.cta.corporateQuestion}{" "}
            <Link
              href={localizedPath("/", lang)}
              className="text-corporate-400 hover:text-white transition underline"
            >
              {t.tourism.cta.corporateLink}
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-corporate-900 border-t border-gray-800 py-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Tour Aventuras Pty ·{" "}
          {t.tourism.footer.location} ·{" "}
          <a
            href="mailto:contacto@touraventuraspty.com"
            className="hover:text-gray-300 transition"
          >
            contacto@touraventuraspty.com
          </a>
        </p>
      </footer>
    </div>
  );
}
