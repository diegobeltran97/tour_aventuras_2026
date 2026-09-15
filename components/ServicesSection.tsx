import { FaCarSide, FaPlaneDeparture, FaUserGear, FaCheck } from "react-icons/fa6";
import type { Dictionary } from "@/i18n/dictionaries";

export default function ServicesSection({ t }: { t: Dictionary["services"] }) {
  const cards = [
    { key: "mobility" as const, icon: <FaCarSide />, badge: false },
    { key: "travel" as const, icon: <FaPlaneDeparture />, badge: true },
    { key: "mice" as const, icon: <FaUserGear />, badge: false },
  ];

  return (
    <section id="servicios" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-corporate-500 font-bold tracking-wide uppercase text-sm mb-2">
            {t.eyebrow}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-4">
            {t.title}
          </h3>
          <p className="text-gray-600 text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map(({ key, icon, badge }) => {
            const item = t.items[key];
            return (
              <div
                key={key}
                className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group${
                  badge ? " relative overflow-hidden" : ""
                }`}
              >
                {badge && (
                  <div className="absolute top-0 right-0 bg-corporate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {t.badge}
                  </div>
                )}
                <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl mb-6 group-hover:bg-corporate-500 group-hover:text-white transition">
                  {icon}
                </div>
                <h4 className="text-xl font-bold text-corporate-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <FaCheck className="text-accent-500 shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
