"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SiDocker } from "react-icons/si";
import RippleEffect from "@/components/animations/RippleEffect";

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
    <nav className="sticky top-0 z-50 border-b border-gray-800/30 bg-gradient-to-b from-gray-950/95 to-gray-950/80 shadow-lg shadow-gray-950/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 text-xl font-bold text-white transition-all">
          <div className="relative">
            <SiDocker className="h-7 w-7 text-blue-400 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DevOps Learn</span>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-blue-300 shadow-lg shadow-blue-600/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span className="mr-1.5 hidden sm:inline">{link.icon}</span>
                {link.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <RippleEffect className="hidden sm:flex">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/custom-exam"
                className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
              >
                <span>Custom Exam</span>
                <motion.svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </Link>
            </motion.div>
          </RippleEffect>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/level-test"
              className="rounded-lg border border-gray-600/50 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur transition-all duration-300 hover:border-cyan-500/50 hover:bg-gray-800/50 hover:text-white hover:shadow-lg hover:shadow-cyan-600/10"
            >
              Level Test
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
