import Link from "next/link";

const footerLinks = [
  { href: "/cheatsheet", label: "Cheat Sheet", icon: "📋" },
  { href: "/playground", label: "Playground", icon: "💻" },
  { href: "/level-test", label: "Level Test", icon: "🎯" },
];

const communityLinks = [
  { href: "#", label: "GitHub", icon: "🐙" },
  { href: "#", label: "Discord", icon: "💬" },
  { href: "#", label: "Twitter", icon: "𝕏" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-800/30 bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                DevOps Learn
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Master Docker, Kubernetes, and DevOps through interactive visual learning. Free and open source.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Learn</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-blue-400"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Community</h3>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-cyan-400"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 font-semibold text-white">Platform Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lessons</span>
                <span className="font-semibold text-blue-400">50+</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Diagrams</span>
                <span className="font-semibold text-cyan-400">100+</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Learners</span>
                <span className="font-semibold text-purple-400">100K+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800/30"></div>

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-sm">
          <p className="text-gray-500">
            © {currentYear} DevOps Learn. Built with <span className="text-red-500">❤️</span> for developers.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
