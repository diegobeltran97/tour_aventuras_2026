import { FaLinkedin, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-corporate-900 border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-corporate-500 to-accent-500 rounded flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="font-bold text-white tracking-tight">
            Tour Aventuras PTY{" "}
            <span className="font-light text-corporate-500">| Corporate</span>
          </span>
        </div>
        <div className="text-sm">
          Ciudad de Panamá, Panamá | atencion@aventuraspty.com | +507 XXXX-XXXX
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className="hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-xl" />
          </a>
          <a
            href="#"
            className="hover:text-white transition"
            aria-label="Instagram"
          >
            <FaInstagram className="text-xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
