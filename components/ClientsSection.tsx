export default function ClientsSection() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">
          Empresas que confían en nuestros estándares de calidad
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <h2 className="text-2xl font-black text-gray-800">ASOFARMA</h2>
          <h2 className="text-2xl font-black text-gray-800">sodexo</h2>
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter">CEVAXIN</h2>
          <h2 className="text-2xl font-black text-gray-800">pluxe</h2>
        </div>
      </div>
    </section>
  );
}
