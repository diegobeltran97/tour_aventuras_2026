import { SiAdidas, SiHuawei } from "react-icons/si";

export default function ClientsSection() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">
          Empresas que confían en nuestros estándares de calidad
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <h2 className="text-2xl font-black text-gray-800">ASOFARMA</h2>
          <h2 className="text-2xl font-black text-gray-800">sodexo</h2>
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter">CEVAXIN</h2>
          <h2 className="text-2xl font-black text-gray-800">pluxe</h2>
          <div className="flex flex-col items-center gap-1">
            <SiAdidas className="text-4xl text-gray-800" />
            <span className="text-xs font-bold text-gray-600 tracking-widest uppercase">Adidas</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SiHuawei className="text-4xl text-gray-800" />
            <span className="text-xs font-bold text-gray-600 tracking-widest uppercase">Huawei</span>
          </div>
        </div>
      </div>
    </section>
  );
}
