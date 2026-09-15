import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { htmlLang, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { siteUrl } from "@/i18n/seo";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

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
