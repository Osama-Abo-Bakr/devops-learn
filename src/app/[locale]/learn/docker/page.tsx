import { getModule } from "@/data/modules";
import ModuleLessonList from "@/components/progress/ModuleLessonList";

export default async function DockerModulePage() {
  const moduleData = getModule("docker");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <a
          href="/learn"
          className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Learning Paths
        </a>
        <h1 className="text-3xl font-bold text-white">🐳 {moduleData.title}</h1>
        <p className="mt-2 text-gray-400">{moduleData.description}</p>
      </div>

      <ModuleLessonList lessons={moduleData.lessons} topic="docker" />
    </div>
  );
}