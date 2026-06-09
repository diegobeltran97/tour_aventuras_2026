import { FaCarSide, FaPlaneDeparture, FaUserGear, FaCheck } from "react-icons/fa6";

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-corporate-500 font-bold tracking-wide uppercase text-sm mb-2">
            Nuestro Portafolio
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-4">
            Todo lo que su empresa necesita, en un solo lugar
          </h3>
          <p className="text-gray-600 text-lg">
            Elimine la fricción de gestionar múltiples proveedores. Cubrimos toda la cadena logística de su personal y ejecutivos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Movilidad y Traslados */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
            <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl mb-6 group-hover:bg-corporate-500 group-hover:text-white transition">
              <FaCarSide />
            </div>
            <h4 className="text-xl font-bold text-corporate-900 mb-3">Movilidad y Traslados</h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Flotas ejecutivas impecables, transporte de personal y choferes capacitados. Puntualidad absoluta desde el aeropuerto hasta la oficina.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Traslados Aeropuerto (VIP)
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Rutas para personal
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Vehículos a disposición
              </li>
            </ul>
          </div>

          {/* Gestión de Viajes — Most requested */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-corporate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              MÁS SOLICITADO
            </div>
            <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl mb-6 group-hover:bg-corporate-500 group-hover:text-white transition">
              <FaPlaneDeparture />
            </div>
            <h4 className="text-xl font-bold text-corporate-900 mb-3">Gestión de Viajes (TMC)</h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Emisión de tiquetes aéreos corporativos y reservas de hospedaje con tarifas competitivas. Control total de viáticos.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Tiquetes aéreos globales
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Convenios hoteleros
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Asistencia 24/7 a viajeros
              </li>
            </ul>
          </div>

          {/* Logística MICE */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
            <div className="w-14 h-14 bg-corporate-50 rounded-xl flex items-center justify-center text-corporate-500 text-2xl mb-6 group-hover:bg-corporate-500 group-hover:text-white transition">
              <FaUserGear />
            </div>
            <h4 className="text-xl font-bold text-corporate-900 mb-3">Logística MICE</h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Soluciones de apoyo para Reuniones, Incentivos, Conferencias y Eventos. Organización fluida para que usted se enfoque en el contenido.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Coordinación de Congresos
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Viajes de incentivo
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-accent-500 shrink-0" /> Logística de invitados
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
