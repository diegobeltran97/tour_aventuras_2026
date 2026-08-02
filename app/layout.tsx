import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-gray-50 text-gray-800 antialiased">{children}</body>
    </html>
  );
}
