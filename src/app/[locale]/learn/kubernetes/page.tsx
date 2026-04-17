import Link from "next/link";
import { getModule } from "@/data/modules";
import LevelBadge from "@/components/progress/LevelBadge";

export default async function KubernetesModulePage() {
  const moduleData = getModule("kubernetes");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/learn"
          className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Learning Paths
        </Link>
        <h1 className="text-3xl font-bold text-white">☸️ {moduleData.title}</h1>
        <p className="mt-2 text-gray-400">{moduleData.description}</p>
      </div>

      <div className="space-y-6">
        {(["beginner", "intermediate", "advanced"] as const).map((level) => {
          const lessons = moduleData.lessons.filter((l) => l.level === level);
          if (lessons.length === 0) return null;

          return (
            <div key={level}>
              <div className="mb-3 flex items-center gap-2">
                <LevelBadge level={level} />
                <h2 className="text-lg font-semibold text-white capitalize">
                  {level}
                </h2>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/learn/kubernetes/${lesson.slug}`}
                    className="block rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{lesson.title}</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="ml-4 flex shrink-0 items-center gap-2 text-sm text-gray-500">
                        <span>{lesson.duration}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}