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
