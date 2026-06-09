import Image from "next/image";
import { FaLinkedin, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-corporate-900 border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tour Aventuras PTY" width={36} height={28} className="rounded brightness-110" />
          <span className="font-bold text-white tracking-tight">
            Tour Aventuras PTY{" "}
            <span className="font-light text-corporate-500">| Corporate</span>
          </span>
        </div>
        <div className="text-sm">
          Ciudad de Panamá, Panamá | touraventuraspty@gmail.com | +507 6544-1217
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
