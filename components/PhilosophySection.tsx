import { FaFileInvoiceDollar, FaShieldHalved, FaHeadset } from "react-icons/fa6";

export default function PhilosophySection() {
  return (
    <section id="filosofia" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image column */}
          <div className="w-full lg:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2070&auto=format&fit=crop"
              alt="Ejecutivos en Panamá"
              className="rounded-2xl shadow-2xl z-10 relative"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-corporate-500 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-gray-200 rounded-full -z-10 opacity-50" />
          </div>

          {/* Content column */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-6">
              Hospitalidad Corporativa con{" "}
              <span className="text-corporate-500">Precisión Militar.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nuestra ideología se basa en la &ldquo;Doble Promesa&rdquo;: garantizamos un viaje cómodo y seguro para el pasajero, al mismo tiempo que brindamos una gestión transparente, centralizada y eficiente para el departamento administrativo que nos contrata.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                  <FaFileInvoiceDollar />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-corporate-900">Una Sola Factura</h5>
                  <p className="text-gray-600">
                    Olvídese de procesar pagos a múltiples choferes o agencias. Entregamos reportes centralizados y facturación consolidada a 30 días.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                  <FaShieldHalved />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-corporate-900">Estándares Farmacéuticos</h5>
                  <p className="text-gray-600">
                    Trabajar con el sector salud nos enseñó a no cometer errores. Aplicamos estrictos protocolos de bioseguridad y puntualidad.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-corporate-50 flex items-center justify-center text-corporate-500 text-xl">
                  <FaHeadset />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-corporate-900">Soporte Real 24/7</h5>
                  <p className="text-gray-600">
                    Los vuelos se retrasan, las reuniones se extienden. Nuestro equipo está disponible 24/7 para resolver imprevistos sin afectar a su equipo.
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
