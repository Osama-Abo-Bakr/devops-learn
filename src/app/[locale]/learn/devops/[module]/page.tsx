import { notFound } from "next/navigation";
import { getLesson, getModule } from "@/data/modules";
import LessonContent from "@/components/lesson/LessonContent";

export const revalidate = 3600; // 1 hour ISR

export async function generateStaticParams() {
  const mod = getModule("devops");
  return mod.lessons.map((lesson) => ({
    module: lesson.slug,
  }));
}

interface PageProps {
  params: Promise<{ module: string; locale: string }>;
}

export default async function DevOpsLessonPage({ params }: PageProps) {
  const { module: slug, locale } = await params;
  const lesson = getLesson("devops", slug);
  if (!lesson) notFound();

  return <LessonContent lesson={lesson} topic="devops" locale={locale} />;
}