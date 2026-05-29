import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tour Avenuturas PTY | Corporate Solutions",
  description:
    "Soluciones Integrales de Movilidad y Logística Corporativa en Panamá",
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
