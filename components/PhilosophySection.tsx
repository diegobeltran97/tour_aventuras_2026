import { FaRoute, FaFileInvoiceDollar, FaHeadset } from "react-icons/fa6";

export default function PhilosophySection() {
  return (
    <section id="filosofia" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image column */}
          <div className="w-full lg:w-1/2 relative">
            <img
              src="/presentation_pty.png"
              alt="Ejecutivos en Panamá"
              className="rounded-2xl shadow-2xl z-10 relative"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-corporate-500 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-gray-200 rounded-full -z-10 opacity-50" />
          </div>

          {/* Content column */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-6">
              Su Aliado en{" "}
              <span className="text-corporate-500">
                Turismo de Negocios en Panamá.
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Somos el socio estratégico de las empresas que se mueven por
              Panamá. Nos encargamos de toda la logística del viaje corporativo
              —traslados, agendas e imprevistos— para que su equipo se concentre
              en lo que realmente importa: cerrar negocios.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                  <FaRoute />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-corporate-900">
                    Logística Integral
                  </h5>
                  <p className="text-gray-600">
                    Coordinamos traslados ejecutivos, conexiones aéreas y
                    agendas desde un único punto de contacto. Usted delega la
                    operación; nosotros la ejecutamos sin fricciones.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                  <FaFileInvoiceDollar />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-corporate-900">
                    Gestión Corporativa
                  </h5>
                  <p className="text-gray-600">
                    Una sola factura consolidada y reportes centralizados.
                    Olvídese de coordinar múltiples proveedores: le damos
                    control y visibilidad total del gasto de viaje.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                  <FaHeadset />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-corporate-900">
                    Soporte Real 24/7
                  </h5>
                  <p className="text-gray-600">
                    Los vuelos se retrasan y las reuniones se extienden. Un
                    equipo dedicado está disponible las 24 horas para resolver
                    cualquier imprevisto sin afectar a su equipo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
