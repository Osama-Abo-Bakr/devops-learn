import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            DevOps Learn — Free, visual learning for Docker, Kubernetes & more.
          </p>
          <div className="flex gap-6">
            <Link
              href="/cheatsheet"
              className="text-sm text-gray-400 hover:text-white"
            >
              Cheat Sheet
            </Link>
            <Link
              href="/playground"
              className="text-sm text-gray-400 hover:text-white"
            >
              Playground
            </Link>
            <Link
              href="/level-test"
              className="text-sm text-gray-400 hover:text-white"
            >
              Level Test
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}