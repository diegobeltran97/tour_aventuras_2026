import type { Metadata } from "next";
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
        <HeroSection t={t.hero} />
        <ClientsSection t={t.clients} />
        <ServicesSection t={t.services} />
        <PhilosophySection t={t.philosophy} />
        <AIPlannerSection t={t.planner} />
        <ContactSection t={t.contact} />
      </main>
      <Footer t={t.footer} />
    </>
  );
}
