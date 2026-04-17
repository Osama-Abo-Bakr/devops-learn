import { notFound } from "next/navigation";
import { getLesson } from "@/data/modules";
import { getLessonContent } from "@/lib/content";
import LessonLayout from "@/components/layout/LessonLayout";
import { MdxContent } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ module: string; locale: string }>;
}

export default async function DevOpsLessonPage({ params }: PageProps) {
  const { module: slug, locale } = await params;
  const lesson = getLesson("devops", slug);
  if (!lesson) notFound();

  const content = getLessonContent(locale as "en" | "ar", "devops", slug);
  if (!content) notFound();

  return (
    <LessonLayout lesson={lesson} topic="devops">
      <MdxContent source={content} />
    </LessonLayout>
  );
}