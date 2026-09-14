import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { htmlLang, locales } from "@/i18n/config";
import { hasLocale } from "@/i18n/dictionaries";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

const siteUrl = "https://www.touraventuraspty.com";
const siteTitle = "Tour Aventuras PTY | Corporate Solutions";
const siteDescription =
  "Soluciones Integrales de Movilidad y Logística Corporativa en Panamá";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: { url: "/logo_final_icon.svg", type: "image/svg+xml" },
  },
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: siteUrl,
    siteName: "Tour Aventuras PTY",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/logo_final_icon.png",
        width: 1200,
        height: 1200,
        alt: "Tour Aventuras PTY",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo_final_icon.png"],
  },
};

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
