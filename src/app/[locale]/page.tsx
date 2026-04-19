"use client";

import { getAllModules } from "@/data/modules";
import ModuleCard from "@/components/progress/ModuleCard";

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

      {/* Advanced CI/CD Highlight */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/80 via-gray-900 to-purple-950/80 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  New
                </span>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Advanced
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Advanced CI/CD &amp; Container Orchestration at Scale
              </h2>
              <p className="max-w-2xl text-gray-400">
                Real-world case studies from Netflix and Meta. Multi-cluster Kubernetes, service mesh, canary deployments, chaos engineering, and production-grade CI/CD pipelines.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">Spinnaker &amp; Kayenta</span>
                <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">Istio Service Mesh</span>
                <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">Chaos Engineering</span>
                <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">Canary Analysis</span>
                <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">Multi-Cluster K8s</span>
                <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">HPA &amp; Autoscaling</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <a
                href="/learn/devops/advanced-cicd-pipelines"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white transition-colors hover:bg-blue-500"
              >
                Advanced CI/CD
              </a>
              <a
                href="/learn/devops/cicd-at-scale-netflix-meta"
                className="rounded-lg border border-purple-500/40 px-5 py-2.5 text-center font-medium text-purple-300 transition-colors hover:border-purple-400 hover:text-white"
              >
                Netflix &amp; Meta
              </a>
              <a
                href="/learn/devops/container-orchestration-scale"
                className="rounded-lg border border-gray-600 px-5 py-2.5 text-center font-medium text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
              >
                Orchestration at Scale
              </a>
            </div>
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
            <ModuleCard key={mod.slug} module={mod} />
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

      {/* Support Me */}
      <section className="border-t border-gray-800 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 text-5xl">☕</div>
          <h2 className="mb-3 text-2xl font-bold text-white">Support My Work</h2>
          <p className="mb-6 text-gray-400">
            If this platform helped you learn, consider buying me a coffee.
            Your support helps me keep building free AI tools and open-source projects.
          </p>
          <a
            href="https://ko-fi.com/osamaabobakr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            <span>☕</span> Buy Me a Coffee
          </a>
        </div>
      </section>
    </div>
  );
}