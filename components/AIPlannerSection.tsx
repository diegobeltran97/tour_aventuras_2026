"use client";

import { useState } from "react";
import {
  FaRobot,
  FaLayerGroup,
  FaCircleNotch,
  FaTriangleExclamation,
} from "react-icons/fa6";

export default function AIPlannerSection() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function generatePlan() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(false);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
    const prompt = `Como experto en logística B2B de "Tour Aventuras PTY | Corporate Solutions", crea una propuesta rápida de cómo resolverías este requerimiento de un cliente corporativo en Panamá: "${input}".
    Estructura la respuesta en HTML básico sin estilos, usando etiquetas <h3>, <ul>, <li> y <strong>. Incluye una breve introducción, 3 puntos clave sobre cómo gestionarías el transporte, el hospedaje y la coordinación (enfócate en ahorro de costos, puntualidad y entregar UNA SOLA FACTURA a fin de mes), y una breve conclusión invitándolos a agendar la reunión. Mantén un tono muy profesional y ejecutivo.`;

    const delays = [1000, 2000, 4000, 8000, 16000];
    let success = false;

    for (let attempt = 0; attempt < 5 && !success; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: {
                parts: [
                  {
                    text: "Eres un estratega logístico corporativo altamente capacitado que ayuda a empresas a centralizar viajes y transporte.",
                  },
                ],
              },
            }),
          },
        );

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        let text: string =
          data.candidates?.[0]?.content?.parts?.[0]?.text ??
          "No se pudo generar una respuesta.";

        text = text.replace(/```html/g, "").replace(/```/g, "");
        setResult(text);
        success = true;
      } catch {
        if (attempt >= 4) {
          setError(true);
        } else {
          await new Promise((r) => setTimeout(r, delays[attempt]));
        }
      }
    }

    setLoading(false);
  }

  return (
    <section
      id="ai-planner"
      className="py-24 bg-corporate-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-corporate-100 text-corporate-500 text-sm font-semibold mb-6">
          <FaRobot /> Impulsado por Gemini IA
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-corporate-900 mb-4">
          Simulador de Plan Logístico B2B
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Escriba los detalles de su próximo viaje corporativo o evento y
          nuestra IA generará una propuesta estratégica al instante demostrando
          cómo Aventuras PTY puede optimizarlo.
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
            onClick={generatePlan}
            disabled={loading}
            className="w-full bg-linear-to-r from-corporate-500 to-accent-500 text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 text-lg disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaCircleNotch className="animate-spin" /> Analizando
                requerimientos... ✨
              </>
            ) : (
              "✨ Generar Propuesta Estratégica"
            )}
          </button>

          {loading && !result && (
            <div className="mt-8 text-center text-gray-500 py-8 animate-pulse">
              <FaLayerGroup className="text-4xl mb-4 text-corporate-400 mx-auto" />
              <p className="font-medium">
                Nuestra IA está diseñando su ecosistema logístico...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 flex flex-col items-start gap-2">
              <FaTriangleExclamation className="text-xl" />
              Hubo un problema al procesar su solicitud, por favor intente
              nuevamente en unos minutos.
            </div>
          )}

          {result && !error && (
            <div className="mt-8 bg-corporate-50 border border-corporate-200 p-6 md:p-8 rounded-xl text-gray-700 shadow-inner ai-result">
              <div dangerouslySetInnerHTML={{ __html: result }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
