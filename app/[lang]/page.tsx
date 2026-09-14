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
