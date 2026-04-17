import { getAllModules } from "@/data/modules";
import ModuleCard from "@/components/progress/ModuleCard";
import { getCompletionPercentage } from "@/lib/progress";

export default function HomePage() {
  const modules = getAllModules();

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="border-b border-gray-800 bg-gradient-to-b from-gray-950 to-gray-900 py-20 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
            Learn DevOps,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Visually
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            Master Docker, Kubernetes, and Docker Compose through interactive
            diagrams, simulated terminals, and hands-on challenges. Free and
            open source.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/learn/docker"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-500"
            >
              Start Learning
            </a>
            <a
              href="/level-test"
              className="rounded-lg border border-gray-600 px-6 py-3 font-medium text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
            >
              Take Level Test
            </a>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-white">
          Choose Your Path
        </h2>
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
      <section className="border-t border-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
              <div className="mb-3 text-4xl">🗺️</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Interactive Diagrams
              </h3>
              <p className="text-sm text-gray-400">
                Explore architecture visually. Click nodes, follow data flows,
                and see how containers connect.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
              <div className="mb-3 text-4xl">💻</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Terminal Challenges
              </h3>
              <p className="text-sm text-gray-400">
                Practice real commands in a simulated terminal. Complete tasks
                to prove your understanding.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
              <div className="mb-3 text-4xl">📝</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Quizzes
              </h3>
              <p className="text-sm text-gray-400">
                Test your knowledge with multiple-choice quizzes. Get
                explanations for every answer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}