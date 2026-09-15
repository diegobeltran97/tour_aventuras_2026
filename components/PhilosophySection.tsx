import { FaRoute, FaFileInvoiceDollar, FaHeadset } from "react-icons/fa6";
import type { Dictionary } from "@/i18n/dictionaries";

export default function PhilosophySection({ t }: { t: Dictionary["philosophy"] }) {
  const pillars = [
    { key: "logistics" as const, icon: <FaRoute /> },
    { key: "management" as const, icon: <FaFileInvoiceDollar /> },
    { key: "support" as const, icon: <FaHeadset /> },
  ];

  return (
    <section id="filosofia" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image column */}
          <div className="w-full lg:w-1/2 relative">
            <img
              src="/presentation_pty.png"
              alt={t.imageAlt}
              className="rounded-2xl shadow-2xl z-10 relative"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-corporate-500 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-gray-200 rounded-full -z-10 opacity-50" />
          </div>

          {/* Content column */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-6">
              {t.title.before}
              <span className="text-corporate-500">{t.title.highlight}</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t.intro}
            </p>

            <div className="space-y-6">
              {pillars.map(({ key, icon }) => (
                <div key={key} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                    {icon}
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-corporate-900">
                      {t.pillars[key].title}
                    </h5>
                    <p className="text-gray-600">{t.pillars[key].description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
