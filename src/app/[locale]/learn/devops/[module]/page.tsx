import { notFound } from "next/navigation";
import { getLesson } from "@/data/modules";
import LessonContent from "@/components/lesson/LessonContent";

interface PageProps {
  params: Promise<{ module: string; locale: string }>;
}

export default async function DevOpsLessonPage({ params }: PageProps) {
  const { module: slug, locale } = await params;
  const lesson = getLesson("devops", slug);
  if (!lesson) notFound();

  return <LessonContent lesson={lesson} topic="devops" locale={locale} />;
}