"use client";

import SkillTreeCanvas from "@/components/skill-tree/SkillTreeCanvas";

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="border-b border-gray-800 bg-gradient-to-b from-gray-950 to-gray-900 px-4 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Learn DevOps,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Visually
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
            Master Docker, Kubernetes, and Docker Compose through interactive
            diagrams, simulated terminals, and hands-on challenges. Free and
            open source.
          </p>
        </div>
      </section>

      {/* Skill Tree */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-bold text-white">
          Your Learning Path
        </h2>
        <SkillTreeCanvas />
      </section>
    </div>
  );
}