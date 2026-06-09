import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaCheck,
  FaClock,
  FaUsers,
  FaCity,
  FaMoon,
  FaLeaf,
  FaShip,
  FaMapLocationDot,
} from "react-icons/fa6";

/* ─── Tour data from brochure ─── */

const cityTours = [
  {
    name: "City Tour por la Ciudad de Panamá",
    duration: "4–6 horas",
    description:
      "Comparte un medio día con nosotros conociendo la historia y lo contemporáneo de una ciudad con tan variadas culturas históricas y modernas.",
    includes: [
      "Transporte A/C + agua y snacks",
      "Ciudad contemporánea: Cinta Costera, Teatro Balboa, Admin. del Canal",
      "Casco Antiguo: Catedral Metropolitana, Iglesia del Altar de Oro, Puente de los Enamorados",
      "Canal de Panamá y Museo del Canal",
      "Duty Free de Amador (Causeway) y Albrook Mall",
      "Guía",
    ],
  },
  {
    name: "City Tour Nocturno",
    duration: "Noche",
    description:
      "Conoce un lugar mágico junto al mar donde puedes observar la Ciudad de Panamá, disfrutando de una noche cálida e histórica.",
    includes: [
      "Transporte",
      "Paseo por el Casco Antiguo",
      "Calzada de Amador",
      "Guía",
    ],
  },
  {
    name: "Tour Nocturno — Vida Nocturna",
    duration: "Noche",
    description:
      "Uno de los destinos más visitados por residentes y turistas en Ciudad de Panamá debido a la variedad gastronómica, bebidas de diferentes estilos y discotecas.",
    includes: [
      "Traslado de ida al Casco Antiguo",
      "Visita a 7 bares",
      "6 cócteles incluidos",
      "Entrada de nachos",
    ],
  },
];

const ecoTours = [
  {
    name: "Isla de los Monos — Gamboa",
    duration: "Medio día",
    description:
      "Disfruta del majestuoso paisaje tropical conociendo diferentes especies en el Lago Gatún, lleno de vida salvaje. Navega lentamente por el punto más alto del Canal de Panamá.",
    includes: [
      "Transporte terrestre",
      "Traslado en lancha",
      "Fruta y agua",
      "Guía",
    ],
    note: null,
  },
  {
    name: "San Blas",
    duration: "Todo el día",
    description:
      "El tiempo se detiene en las raíces de la cultura Guna, en un lugar de arena blanca y aguas cristalinas. Visita 3 islas: Isla Perro Chico, Isla Wailidub y Piscinas Naturales.",
    includes: [
      "Almuerzo y bebidas",
      "Transporte terrestre",
      "Transporte acuático",
      "Impuestos comarcales",
    ],
    note: null,
  },
  {
    name: "Emberá",
    duration: "6–8 horas",
    description:
      "Disfruta de la biodiversidad navegando por el Río Chagres, comparte y convive a través de las raíces y tradiciones de la comunidad indígena.",
    includes: [
      "Transporte terrestre",
      "Paseo en piragua a motor",
      "Almuerzo tradicional Emberá",
      "Merienda de fruta",
      "Visita a la cascada (según clima)",
    ],
    note: "Mínimo 2 personas",
  },
  {
    name: "Tránsito Parcial — Canal de Panamá",
    duration: "6–8 horas",
    description:
      "Vive el Canal de Panamá navegando a bordo de un ferry por su histórico cauce. Admira esta maravilla de la ingeniería y su funcionamiento.",
    includes: [
      "Transporte hotel–puerto (ida y vuelta)",
      "Guía",
      "Desayuno y almuerzo",
      "Snacks",
    ],
    note: null,
  },
];

const shoppingTour = {
  name: "Zona Libre de Colón",
  duration: "Todo el día",
  description:
    "Considerada la segunda zona franca más grande del mundo y la primera en el hemisferio occidental. Famosa por compras sin límite y libre de impuestos: electrónicos, licores, muebles, ropa, zapatos, joyas, relojes y perfumes de las marcas más afamadas.",
  includes: [
    "Traslado ida y vuelta a la Zona Franca de Colón",
    "Guía",
    "Botella de agua",
  ],
};

/* ─── Card components ─── */

function TourCard({
  tour,
  icon,
}: {
  tour: (typeof cityTours)[0] & { note?: string | null };
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group">
      <div className="w-12 h-12 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-xl mb-5 group-hover:bg-corporate-500 group-hover:text-white transition">
        {icon}
      </div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-corporate-900 leading-snug">{tour.name}</h3>
        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-corporate-500 bg-corporate-50 px-2 py-1 rounded-full whitespace-nowrap">
          <FaClock className="text-[10px]" /> {tour.duration}
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{tour.description}</p>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Incluye</p>
        <ul className="space-y-1.5">
          {tour.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaCheck className="text-accent-500 shrink-0 mt-0.5 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        {tour.note && (
          <p className="mt-3 text-xs font-semibold text-corporate-500 bg-corporate-50 px-3 py-1.5 rounded-lg inline-block">
            {tour.note}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  title,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-corporate-100 text-corporate-500 text-sm font-semibold mb-4">
        {icon} {label}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-3">{title}</h2>
      <p className="text-gray-500 text-lg">{description}</p>
    </div>
  );
}

/* ─── Page ─── */

export default function TurismoPage() {
  const whatsapp = "https://wa.me/50765441217";

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Tour Aventuras PTY" width={44} height={34} className="rounded-md" />
            <div>
              <span className="font-bold text-corporate-900 text-sm leading-tight block">Tour Aventuras PTY</span>
              <span className="text-corporate-500 text-xs font-semibold">Servicios Turísticos</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-corporate-500 transition font-medium"
          >
            <FaArrowLeft className="text-xs" /> Sección Corporativa
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="min-h-[60vh] flex items-center pt-0 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.88)), url('https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2073&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-corporate-400 text-sm font-semibold mb-6">
              <FaMapLocationDot /> Turismo en Panamá
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              Descubre Panamá con{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-corporate-400 to-accent-500">
                Tour Aventuras PTY
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
              Nos destacamos por realzar la belleza cultural, natural e histórica de nuestro hermoso país, convirtiendo cada visita en una mezcla de sensaciones y experiencias que perdurarán en los recuerdos de nuestros visitantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:opacity-90 text-white px-7 py-3.5 rounded-md font-semibold text-base transition shadow-lg"
              >
                <FaWhatsapp className="text-lg" /> Consultar por WhatsApp
              </a>
              <a
                href="#tours"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-md font-semibold text-base hover:bg-white/20 transition backdrop-blur-sm"
              >
                Ver todos los tours
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick stats ── */}
      <section className="bg-corporate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "24/7", label: "Servicio diario" },
              { value: "150", label: "Pasajeros máx." },
              { value: "8+", label: "Tours disponibles" },
              { value: "100%", label: "Guías profesionales" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-corporate-400">{s.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Tours ── */}
      <section id="tours" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={<FaCity />}
            label="City Tours"
            title="Descubre la Ciudad de Panamá"
            description="Tours diurnos y nocturnos por los rincones más icónicos de la capital."
          />
          <div className="grid md:grid-cols-3 gap-7">
            {cityTours.map((t) => (
              <TourCard key={t.name} tour={t} icon={<FaCity />} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Ecoturismo ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={<FaLeaf />}
            label="Ecoturismo & Naturaleza"
            title="Vive la naturaleza panameña"
            description="Selva tropical, ríos, islas paradisíacas y el Canal de Panamá en una sola experiencia."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {ecoTours.map((t) => (
              <TourCard key={t.name} tour={t} icon={<FaLeaf />} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Zona Libre (featured) ── */}
      <section className="py-20 bg-corporate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={<FaShip />}
            label="Compras"
            title="Zona Libre de Colón"
            description="La segunda zona franca más grande del mundo, en el hemisferio occidental."
          />
          <div className="bg-white rounded-2xl shadow-sm border border-corporate-100 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl shrink-0">
              <FaShip />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-corporate-900">{shoppingTour.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-corporate-500 bg-corporate-50 px-2 py-1 rounded-full">
                  <FaClock className="text-[10px]" /> {shoppingTour.duration}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{shoppingTour.description}</p>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Incluye</p>
                <ul className="flex flex-wrap gap-3">
                  {shoppingTour.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <FaCheck className="text-accent-500 text-xs shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section className="bg-corporate-900 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para vivir la experiencia?
          </h2>
          <p className="text-corporate-400 text-lg mb-10 font-light max-w-xl mx-auto">
            Contáctanos y diseñamos el itinerario perfecto para ti o tu grupo, sin costos ocultos.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-5 rounded-xl transition"
            >
              <FaWhatsapp className="text-2xl text-accent-500" />
              <span className="font-semibold text-sm">6544-1217</span>
              <span className="text-xs text-gray-400">WhatsApp</span>
            </a>
            <a
              href="mailto:touraventuraspty@gmail.com"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-5 rounded-xl transition"
            >
              <FaEnvelope className="text-2xl text-corporate-400" />
              <span className="font-semibold text-sm truncate w-full text-center text-xs">touraventuraspty@gmail.com</span>
              <span className="text-xs text-gray-400">Correo</span>
            </a>
            <a
              href="https://instagram.com/Tour_aventuras"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-5 rounded-xl transition"
            >
              <FaInstagram className="text-2xl text-pink-400" />
              <span className="font-semibold text-sm">@Tour_aventuras</span>
              <span className="text-xs text-gray-400">Instagram</span>
            </a>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent-500 hover:opacity-90 text-white px-8 py-4 rounded-md font-bold text-lg transition shadow-lg"
          >
            <FaWhatsapp className="text-xl" /> Reservar mi tour ahora
          </a>

          <p className="mt-8 text-sm text-gray-500">
            ¿Eres empresa?{" "}
            <Link href="/" className="text-corporate-400 hover:text-white transition underline">
              Ver soluciones corporativas →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-corporate-900 border-t border-gray-800 py-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Tour Aventuras PTY · Ciudad de Panamá ·{" "}
          <a href="mailto:touraventuraspty@gmail.com" className="hover:text-gray-300 transition">
            touraventuraspty@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
