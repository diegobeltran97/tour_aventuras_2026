"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const segments = [
  { href: "/", label: "Corporativo" },
  { href: "/turismo", label: "Turismo" },
] as const;

export default function ModeToggle({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const isTurismo = pathname?.startsWith("/turismo");

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-corporate-900 p-1 ${className}`}
      role="group"
      aria-label="Cambiar entre sitio corporativo y turismo"
    >
      {segments.map((seg) => {
        const active =
          seg.href === "/turismo" ? isTurismo : !isTurismo;
        return (
          <Link
            key={seg.href}
            href={seg.href}
            aria-current={active ? "page" : undefined}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              active
                ? "bg-corporate-500 text-white shadow-sm"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {seg.label}
          </Link>
        );
      })}
    </div>
  );
}
