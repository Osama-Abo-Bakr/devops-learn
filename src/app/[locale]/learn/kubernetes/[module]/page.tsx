import { notFound } from "next/navigation";
import { getLesson } from "@/data/modules";
import { getLessonContent } from "@/lib/content";
import LessonLayout from "@/components/layout/LessonLayout";
import { MdxContent } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ module: string; locale: string }>;
}

export default async function KubernetesLessonPage({ params }: PageProps) {
  const { module: slug, locale } = await params;
  const lesson = getLesson("kubernetes", slug);
  if (!lesson) notFound();

  const content = getLessonContent(locale as "en" | "ar", "kubernetes", slug);
  if (!content) notFound();

  return (
    <LessonLayout lesson={lesson} topic="kubernetes">
      <MdxContent source={content} />
    </LessonLayout>
  );
}