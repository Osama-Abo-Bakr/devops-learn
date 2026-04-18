"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiDocker } from "react-icons/si";

const navLinks = [
  { href: "/learn/docker", label: "Docker", icon: "🐳" },
  { href: "/learn/compose", label: "Compose", icon: "📦" },
  { href: "/learn/kubernetes", label: "Kubernetes", icon: "☸️" },
  { href: "/learn/devops", label: "DevOps", icon: "🚀" },
  { href: "/playground", label: "Playground", icon: "💻" },
  { href: "/cheatsheet", label: "Cheat Sheet", icon: "📋" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <SiDocker className="h-7 w-7 text-blue-400" />
          <span className="hidden sm:inline">DevOps Learn</span>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-1 hidden sm:inline">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/custom-exam"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Custom Exam
          </Link>
          <Link
            href="/level-test"
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-blue-500 hover:text-white"
          >
            Level Test
          </Link>
        </div>
      </div>
    </nav>
  );
}