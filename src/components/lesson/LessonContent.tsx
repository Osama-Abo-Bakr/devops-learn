import type { Lesson, Topic } from "@/types";
import { getLessonContent, getContentBody } from "@/lib/content";
import { MdxContent } from "@/lib/mdx";
import LessonLayout from "@/components/layout/LessonLayout";
import LessonInteractive from "@/components/lesson/LessonInteractive";
import ResourcesSection from "@/components/lesson/ResourcesSection";
import { getResourcesForTopic } from "@/data/resources";
import LessonXPTracker from "@/components/lesson/LessonXPTracker";

interface LessonContentProps {
  lesson: Lesson;
  topic: Topic;
  locale: string;
}

function stripInteractiveTags(raw: string): string {
  let body = getContentBody(raw);
  body = body.replace(/<Diagram[^/]*?\/>/g, "");
  body = body.replace(/<Terminal[^/]*?\/>/g, "");
  body = body.replace(/<Quiz[^/]*?\/>/g, "");
  body = body.replace(/<Diagram[\s\S]*?<\/Diagram>/g, "");
  body = body.replace(/<Terminal[\s\S]*?<\/Terminal>/g, "");
  body = body.replace(/<Quiz[\s\S]*?<\/Quiz>/g, "");
  // Remove orphaned section headings for interactive components
  body = body.replace(/^##\s*(Interactive Diagram|Try It Yourself|Test Your Knowledge)\s*\n/gm, "");
  // Remove introductory lines that precede the removed tags
  body = body.replace(/^(Explore how containers relate.*|Practice the commands in the terminal below.*|Test your understanding.*)\n/gm, "");
  return body.trim();
}

export default function LessonContent({
  lesson,
  topic,
  locale,
}: LessonContentProps) {
  const rawContent = getLessonContent(locale as "en" | "ar", topic, lesson.slug);
  const textContent = rawContent ? stripInteractiveTags(rawContent) : "";
  const resources = getResourcesForTopic(topic);
  return (
    <LessonLayout lesson={lesson} topic={topic}>
      <LessonXPTracker lessonSlug={lesson.slug} />
      {textContent && <MdxContent source={textContent} />}
      <LessonInteractive
        diagramId={lesson.diagram}
        challengeId={lesson.challenge}
        quizId={lesson.quiz}
      />
      <ResourcesSection resources={resources} />
    </LessonLayout>
  );
}