"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaBars,
  FaXmark,
  FaBuilding,
  FaCarSide,
  FaPlaneDeparture,
  FaCalendarCheck,
} from "react-icons/fa6";

const navLinks = [
  { href: "#servicios", label: "Soluciones", icon: <FaCarSide /> },
  { href: "#filosofia", label: "Nuestra Filosofía", icon: <FaBuilding /> },
  {
    href: "#ai-planner",
    label: "Planificador ✨",
    icon: <FaPlaneDeparture />,
    highlight: true,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Tour Aventuras PTY" width={48} height={38} className="rounded-md" />
              <span className="font-bold text-xl tracking-tight text-corporate-900">
                Tour Aventuras PTY{" "}
                <span className="font-light text-corporate-500">
                  | Corporate
                </span>
              </span>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={
                    link.highlight
                      ? "text-sm font-semibold text-corporate-500 hover:text-corporate-400 transition"
                      : "text-sm font-semibold text-gray-600 hover:text-corporate-500 transition"
                  }
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                className="bg-corporate-900 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-corporate-800 transition shadow-lg shadow-corporate-900/20"
              >
                Agendar Reunión
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-corporate-900 hover:bg-gray-100 transition"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-corporate-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Tour Aventuras PTY" width={36} height={28} className="rounded-md" />
            <span className="font-bold text-corporate-900 tracking-tight">
              Tour Aventuras PTY
            </span>
          </div>
          <button
            onClick={close}
            className="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:bg-gray-100 transition"
            aria-label="Cerrar menú"
          >
            <FaXmark className="text-xl" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                link.highlight
                  ? "text-corporate-500 bg-corporate-50 hover:bg-corporate-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-corporate-500"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA at the bottom */}
        <div className="px-4 pb-8">
          <a
            href="#contacto"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full bg-corporate-900 text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-corporate-800 transition shadow-lg shadow-corporate-900/20"
          >
            <FaCalendarCheck /> Agendar Reunión
          </a>
          <p className="text-center text-xs text-gray-400 mt-4">
            Ciudad de Panamá, Panamá
          </p>
        </div>
      </aside>
    </>
  );
}
