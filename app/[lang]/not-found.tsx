import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-extrabold text-corporate-900">404</p>
      <Link href="/" className="text-corporate-500 font-semibold hover:underline">
        Tour Aventuras PTY
      </Link>
    </main>
  );
}
