import { notFound } from "next/navigation";
import { getLesson, getModule } from "@/data/modules";
import LessonContent from "@/components/lesson/LessonContent";

export const dynamicParams = false;
export const revalidate = 3600; // 1 hour ISR

export async function generateStaticParams() {
  const mod = getModule("compose");
  return mod.lessons.flatMap((lesson) =>
    (["en", "ar"] as const).map((locale) => ({
      module: lesson.slug,
      locale,
    })),
  );
}

interface PageProps {
  params: Promise<{ module: string; locale: string }>;
}

export default async function ComposeLessonPage({ params }: PageProps) {
  const { module: slug, locale } = await params;
  const lesson = getLesson("compose", slug);
  if (!lesson) notFound();

  return <LessonContent lesson={lesson} topic="compose" locale={locale} />;
}