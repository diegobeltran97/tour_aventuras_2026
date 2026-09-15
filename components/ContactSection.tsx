"use client";

import type { Dictionary } from "@/i18n/dictionaries";

export default function ContactSection({ t }: { t: Dictionary["contact"] }) {
  return (
    <section id="contacto" className="bg-corporate-900 py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {t.title}
        </h2>
        <p className="text-xl text-corporate-400 mb-10 font-light">
          {t.subtitle}
        </p>

        <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl text-left">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.fields.name.label}</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500"
                  placeholder={t.fields.name.placeholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.fields.company.label}</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500"
                  placeholder={t.fields.company.placeholder}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.email.label}
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500"
                placeholder={t.fields.email.placeholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.service.label}
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500">
                {t.serviceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="w-full bg-corporate-900 text-white font-bold py-3 px-4 rounded-md hover:bg-corporate-800 transition mt-4"
              onClick={() =>
                alert(t.demoAlert)
              }
            >
              {t.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
