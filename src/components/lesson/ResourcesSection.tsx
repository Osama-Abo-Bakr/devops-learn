import type { Resource, ResourceType } from "@/data/resources";

interface ResourcesSectionProps {
  resources: Resource[];
}

const TYPE_CONFIG: Record<ResourceType, { label: string; icon: string; color: string }> = {
  video: { label: "Video", icon: "▶", color: "text-red-400 border-red-500/30 bg-red-500/5" },
  article: { label: "Article", icon: "📄", color: "text-blue-400 border-blue-500/30 bg-blue-500/5" },
  docs: { label: "Docs", icon: "📖", color: "text-green-400 border-green-500/30 bg-green-500/5" },
  course: { label: "Course", icon: "🎓", color: "text-purple-400 border-purple-500/30 bg-purple-500/5" },
};

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
  if (resources.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Further Learning
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {resources.map((resource, i) => {
          const config = TYPE_CONFIG[resource.type];
          return (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4 transition-colors hover:border-gray-500"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm ${config.color}`}
              >
                {config.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                  {resource.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {resource.source}
                  <span className="mx-1.5">·</span>
                  {config.label}
                </p>
              </div>
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-gray-600 transition-colors group-hover:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          );
        })}
      </div>
    </section>
  );
}