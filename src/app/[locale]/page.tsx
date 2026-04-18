import { getAllModules } from "@/data/modules";
import ModuleCard from "@/components/progress/ModuleCard";
import { getCompletionPercentage } from "@/lib/progress";

export default function HomePage() {
  const modules = getAllModules();

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800/50 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-24 text-center sm:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4">
          <div className="mb-6 inline-block">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur">
              ✨ Master Cloud Infrastructure
            </span>
          </div>
          
          <h1 className="mb-6 text-6xl font-bold tracking-tight text-white sm:text-7xl">
            Learn DevOps,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Visually
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300">
            Master Docker, Kubernetes, and Docker Compose through interactive
            diagrams, simulated terminals, and hands-on challenges. <span className="font-semibold text-white">Free and open source.</span>
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row justify-center sm:gap-6">
            <a
              href="/learn/docker"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105"
            >
              Start Learning
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/level-test"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-900/50 px-8 py-4 font-semibold text-gray-200 backdrop-blur transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800/50 hover:text-white"
            >
              Take Level Test
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m2-1l-2-1m2 1v2.5" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-800/50 pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">50+</div>
              <p className="mt-1 text-sm text-gray-400">Interactive Lessons</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">100K+</div>
              <p className="mt-1 text-sm text-gray-400">Learners Worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">Free</div>
              <p className="mt-1 text-sm text-gray-400">Open Source</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-4xl font-bold text-white">
            Choose Your Path
          </h2>
          <p className="mt-2 text-gray-400">Select a module and start your DevOps journey</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.slug}
              module={mod}
              completionPercentage={getCompletionPercentage(
                mod.lessons.map((l) => l.slug),
              )}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white">
              Powerful Learning Tools
            </h2>
            <p className="mt-4 text-gray-400">Everything you need to master DevOps</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group relative rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8 transition-all duration-300 hover:border-blue-500/30 hover:bg-gray-900/50 hover:shadow-xl hover:shadow-blue-600/10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-cyan-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
              <div className="relative">
                <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3 text-2xl">🗺️</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Interactive Diagrams
                </h3>
                <p className="text-gray-400">
                  Explore architecture visually. Click nodes, follow data flows,
                  and see how containers connect.
                </p>
              </div>
            </div>
            
            <div className="group relative rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8 transition-all duration-300 hover:border-cyan-500/30 hover:bg-gray-900/50 hover:shadow-xl hover:shadow-cyan-600/10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-600/0 to-blue-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
              <div className="relative">
                <div className="mb-4 inline-block rounded-lg bg-cyan-500/10 p-3 text-2xl">💻</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Terminal Challenges
                </h3>
                <p className="text-gray-400">
                  Practice real commands in a simulated terminal. Complete tasks
                  to prove your understanding.
                </p>
              </div>
            </div>
            
            <div className="group relative rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8 transition-all duration-300 hover:border-blue-500/30 hover:bg-gray-900/50 hover:shadow-xl hover:shadow-blue-600/10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-blue-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
              <div className="relative">
                <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3 text-2xl">📝</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Smart Quizzes
                </h3>
                <p className="text-gray-400">
                  Test your knowledge with adaptive quizzes. Get detailed
                  explanations for every answer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
