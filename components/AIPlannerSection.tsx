"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";

const WHATSAPP_NUMBER = "50765889209";

export default function AIPlannerSection() {
  const [input, setInput] = useState("");

  function sendToWhatsApp() {
    const message = input.trim();
    if (!message) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="ai-planner"
      className="py-24 bg-corporate-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-corporate-100 text-corporate-500 text-sm font-semibold mb-6">
          <FaWhatsapp /> Consulta Directa
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-4">
          Planificador de Logística Corporativa
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Describa los detalles de su próximo viaje o evento corporativo y
          envíenos su requerimiento por WhatsApp. Le responderemos con una
          propuesta estratégica personalizada.
        </p>

        <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto shadow-xl border border-gray-100 text-left">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Describa su requerimiento (Ej: Visita de 4 directivos por 3 días,
              hotel cerca de Costa del Este y transporte a 2 plantas).
            </label>
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-500 focus:border-corporate-500 outline-none transition resize-none"
              placeholder="Tenemos una delegación de..."
            />
          </div>

          <button
            onClick={sendToWhatsApp}
            disabled={!input.trim()}
            className="w-full bg-linear-to-r from-corporate-500 to-accent-500 text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaWhatsapp className="text-xl" /> Enviar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
