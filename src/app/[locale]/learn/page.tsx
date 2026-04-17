import Link from "next/link";
import { getAllModules } from "@/data/modules";
import ModuleCard from "@/components/progress/ModuleCard";
import { getCompletionPercentage } from "@/lib/progress";

export default async function LearnPage() {
  const modules = getAllModules();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Learning Paths</h1>
        <p className="mt-2 text-gray-400">
          Choose a topic and start learning at your own pace.
        </p>
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
    </div>
  );
}