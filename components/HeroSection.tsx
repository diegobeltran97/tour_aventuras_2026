import Link from "next/link";
import { FaBuilding, FaArrowRight, FaUmbrellaBeach } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center pt-20"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-corporate-400 text-sm font-semibold mb-6 backdrop-blur-sm">
            <FaBuilding /> División B2B Logística
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Soluciones Integrales de{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-corporate-400 to-accent-500">
              Movilidad y Logística
            </span>{" "}
            Corporativa.
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
            Centralizamos los traslados, viajes y eventos de su empresa en Panamá. Un solo proveedor, facturación consolidada y precisión garantizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contacto"
              className="bg-corporate-500 text-white px-8 py-4 rounded-md text-center font-semibold text-lg hover:bg-corporate-400 transition shadow-lg shadow-corporate-500/30 flex items-center justify-center gap-2"
            >
              Optimizar Mis Costos <FaArrowRight />
            </a>
            <a
              href="#servicios"
              className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-md text-center font-semibold text-lg hover:bg-white/20 transition backdrop-blur-sm"
            >
              Nuestro Portafolio
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              href="/turismo"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition font-medium"
            >
              <FaUmbrellaBeach className="text-corporate-400" />
              ¿Deseas hacer turismo? Ver paquetes vacacionales →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
