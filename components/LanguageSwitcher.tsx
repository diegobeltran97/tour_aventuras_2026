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
