import { SiAdidas, SiHuawei } from "react-icons/si";
import type { Dictionary } from "@/i18n/dictionaries";

export default function ClientsSection({ t }: { t: Dictionary["clients"] }) {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">
          {t.title}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          <h2 className="text-2xl font-black text-green-700 opacity-70 hover:opacity-100 transition-opacity duration-300">ASOFARMA</h2>
          <h2 className="text-2xl font-black text-blue-700 opacity-70 hover:opacity-100 transition-opacity duration-300">sodexo</h2>
          <h2 className="text-2xl font-black text-teal-600 tracking-tighter opacity-70 hover:opacity-100 transition-opacity duration-300">CEVAXIN</h2>
          <h2 className="text-2xl font-black text-purple-600 opacity-70 hover:opacity-100 transition-opacity duration-300">pluxe</h2>
          <div className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <SiAdidas className="text-4xl text-gray-900" />
            <span className="text-xs font-bold text-gray-700 tracking-widest uppercase">Adidas</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <SiHuawei className="text-4xl text-red-600" />
            <span className="text-xs font-bold text-red-600 tracking-widest uppercase">Huawei</span>
          </div>
        </div>
      </div>
    </section>
  );
}
