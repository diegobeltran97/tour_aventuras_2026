"use client";

export default function ContactSection() {
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
          ¿Listo para optimizar la logística de su empresa?
        </h2>
        <p className="text-xl text-corporate-400 mb-10 font-light">
          Agende una auditoría logística gratuita de 15 minutos. Le mostraremos cómo empresas como la suya ya están ahorrando tiempo y dinero.
        </p>

        <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl text-left">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500"
                  placeholder="Ej. Carlos Mendoza"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500"
                  placeholder="Su Empresa"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Corporativo
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500"
                placeholder="carlos@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Qué servicio requiere optimizar?
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500">
                <option>Traslados y Movilidad</option>
                <option>Gestión de Viajes (Tickets/Hotel)</option>
                <option>Eventos y Logística MICE</option>
                <option>Revisión Integral (Todo)</option>
              </select>
            </div>
            <button
              type="button"
              className="w-full bg-corporate-900 text-white font-bold py-3 px-4 rounded-md hover:bg-corporate-800 transition mt-4"
              onClick={() =>
                alert("Esta es una demostración. Aquí se conectará el envío a tu correo.")
              }
            >
              Solicitar Contacto Comercial
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
