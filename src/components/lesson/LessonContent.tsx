import type { Lesson, Topic } from "@/types";
import { getDiagram, getChallenge, getQuiz } from "@/data";
import { getLessonContent, getContentBody } from "@/lib/content";
import { MdxContent } from "@/lib/mdx";
import LessonLayout from "@/components/layout/LessonLayout";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import TerminalSimulator from "@/components/terminal/TerminalSimulator";
import QuizComponent from "@/components/quiz/QuizComponent";

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

  const diagramConfig = lesson.diagram ? getDiagram(lesson.diagram) : undefined;
  const challengeConfig = lesson.challenge
    ? getChallenge(lesson.challenge)
    : undefined;
  const quizConfig = lesson.quiz ? getQuiz(lesson.quiz) : undefined;

  return (
    <LessonLayout lesson={lesson} topic={topic}>
      {textContent && <MdxContent source={textContent} />}

      {diagramConfig && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Interactive Diagram
          </h2>
          <DiagramCanvas config={diagramConfig} />
        </section>
      )}

      {challengeConfig && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Try It Yourself
          </h2>
          <TerminalSimulator
            commands={challengeConfig.commands}
            initialState={challengeConfig.initialState}
            tasks={challengeConfig.tasks}
          />
        </section>
      )}

      {quizConfig && (
        <section className="mt-8">
          <QuizComponent
            questions={quizConfig.questions}
            title={quizConfig.title}
          />
        </section>
      )}
    </LessonLayout>
  );
}