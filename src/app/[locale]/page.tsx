import { getAllModules } from "@/data/modules";
import ModuleCard from "@/components/progress/ModuleCard";
import { getCompletionPercentage } from "@/lib/progress";
import ParticleSystem from "@/components/animations/ParticleSystem";
import FloatingElements from "@/components/animations/FloatingElements";
import { motion } from "framer-motion";

export default function HomePage() {
  const modules = getAllModules();

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800/50 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-24 text-center sm:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <ParticleSystem count={40} colors={["#3b82f6", "#06b6d4", "#8b5cf6"]} speed={1.5} className="opacity-50" />
          <FloatingElements count={6} />
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4">
          <motion.div
            className="mb-6 inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.span
              className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur inline-block"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
            >
              ✨ Master Cloud Infrastructure
            </motion.span>
          </motion.div>
          
          <motion.h1
            className="mb-6 text-6xl font-bold tracking-tight text-white sm:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Learn DevOps,{" "}
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block"
              animate={{ backgroundPosition: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Visually
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Master Docker, Kubernetes, and Docker Compose through interactive
            diagrams, simulated terminals, and hands-on challenges. <span className="font-semibold text-white">Free and open source.</span>
          </motion.p>
          
          <motion.div
            className="flex flex-col gap-4 sm:flex-row justify-center sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.a
              href="/learn/docker"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/30"
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning
              <motion.svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </motion.a>
            <motion.a
              href="/level-test"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-900/50 px-8 py-4 font-semibold text-gray-200 backdrop-blur"
              whileHover={{
                scale: 1.05,
                borderColor: "rgb(59, 130, 246, 0.7)",
                backgroundColor: "rgba(31, 41, 55, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Take Level Test
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m2-1l-2-1m2 1v2.5"
                />
              </svg>
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-800/50 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { value: "50+", label: "Interactive Lessons", color: "text-blue-400" },
              { value: "100K+", label: "Learners Worldwide", color: "text-cyan-400" },
              { value: "Free", label: "Open Source", color: "text-blue-400" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`text-3xl font-bold ${stat.color}`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
                <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white">
            Choose Your Path
          </h2>
          <p className="mt-2 text-gray-400">Select a module and start your DevOps journey</p>
        </motion.div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {modules.map((mod, idx) => (
            <motion.div
              key={mod.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ModuleCard
                module={mod}
                completionPercentage={getCompletionPercentage(
                  mod.lessons.map((l) => l.slug),
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white">
              Powerful Learning Tools
            </h2>
            <p className="mt-4 text-gray-400">Everything you need to master DevOps</p>
          </motion.div>
          
          <motion.div
            className="grid gap-8 sm:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
          >
            {[
              {
                icon: "🗺️",
                title: "Interactive Diagrams",
                description: "Explore architecture visually. Click nodes, follow data flows, and see how containers connect.",
                color: "blue",
              },
              {
                icon: "💻",
                title: "Terminal Challenges",
                description: "Practice real commands in a simulated terminal. Complete tasks to prove your understanding.",
                color: "cyan",
              },
              {
                icon: "📝",
                title: "Smart Quizzes",
                description: "Test your knowledge with adaptive quizzes. Get detailed explanations for every answer.",
                color: "blue",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className={`group relative rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{
                  borderColor: `rgb(${feature.color === "blue" ? "59, 130, 246" : "6, 182, 212"}, 0.5)`,
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                <div className="relative">
                  <motion.div
                    className={`mb-4 inline-block rounded-lg ${
                      feature.color === "blue" ? "bg-blue-500/10" : "bg-cyan-500/10"
                    } p-3 text-2xl`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
