import type { Lesson, Topic } from "@/types";
import { getLessonContent, getContentBody } from "@/lib/content";
import { MdxContent } from "@/lib/mdx";
import LessonLayout from "@/components/layout/LessonLayout";
import LessonInteractive from "@/components/lesson/LessonInteractive";

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
  return body.trim();
}

export default function LessonContent({
  lesson,
  topic,
  locale,
}: LessonContentProps) {
  const rawContent = getLessonContent(locale as "en" | "ar", topic, lesson.slug);
  const textContent = rawContent ? stripInteractiveTags(rawContent) : "";

  return (
    <LessonLayout lesson={lesson} topic={topic}>
      {textContent && <MdxContent source={textContent} />}
      <LessonInteractive
        diagramId={lesson.diagram}
        challengeId={lesson.challenge}
        quizId={lesson.quiz}
      />
    </LessonLayout>
  );
}