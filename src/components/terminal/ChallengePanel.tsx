"use client";

import type { ChallengeTask } from "@/types";

interface ChallengePanelProps {
  tasks: ChallengeTask[];
  completedTaskIds: Set<string>;
}

export default function ChallengePanel({
  tasks,
  completedTaskIds,
}: ChallengePanelProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Challenge Tasks
      </h3>
      <ul className="space-y-2">
        {tasks.map((task) => {
          const completed = completedTaskIds.has(task.id);
          return (
            <li key={task.id} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 ${completed ? "text-green-400" : "text-gray-600"}`}>
                {completed ? "✓" : "○"}
              </span>
              <span className={completed ? "text-green-400 line-through" : "text-gray-300"}>
                {task.instruction}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}