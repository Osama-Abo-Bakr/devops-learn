"use client";

import { useState } from "react";
import { cheatsheetData, type CheatsheetCategory } from "@/data/cheatsheet";

const topics = ["docker", "compose", "kubernetes"] as const;
const topicLabels = { docker: "Docker", compose: "Docker Compose", kubernetes: "Kubernetes" };
const topicIcons = { docker: "🐳", compose: "📦", kubernetes: "☸️" };

export default function CheatsheetPage() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("docker");

  const filtered = cheatsheetData
    .filter((cat) => cat.topic === activeTopic)
    .map((cat) => ({
      ...cat,
      commands: cat.commands.filter(
        (cmd) =>
          cmd.command.toLowerCase().includes(search.toLowerCase()) ||
          cmd.description.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.commands.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Quick Reference</h1>
        <p className="mt-2 text-gray-400">
          Common Docker, Compose, and Kubernetes commands at a glance.
        </p>
      </div>

      {/* Topic tabs */}
      <div className="mb-6 flex gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTopic === topic
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {topicIcons[topic]} {topicLabels[topic]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search commands..."
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {filtered.map((category) => (
          <div key={category.category}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              {category.category}
            </h2>
            <div className="space-y-2">
              {category.commands.map((cmd) => (
                <div
                  key={cmd.command}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <code className="text-sm font-semibold text-blue-400">
                        {cmd.command}
                      </code>
                      <p className="mt-1 text-sm text-gray-400">
                        {cmd.description}
                      </p>
                    </div>
                    <code className="shrink-0 rounded bg-gray-800 px-2 py-1 text-xs text-green-400">
                      {cmd.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}