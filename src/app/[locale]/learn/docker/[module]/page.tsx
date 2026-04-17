import { notFound } from "next/navigation";
import { getModule, getLesson } from "@/data/modules";
import { getLessonContent } from "@/lib/content";
import LessonLayout from "@/components/layout/LessonLayout";
import { MdxContent } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ module: string; locale: string }>;
}

export default async function DockerLessonPage({ params }: PageProps) {
  const { module: slug, locale } = await params;
  const lesson = getLesson("docker", slug);
  if (!lesson) notFound();

  const content = getLessonContent(locale as "en" | "ar", "docker", slug);
  if (!content) notFound();

  return (
    <LessonLayout lesson={lesson} topic="docker">
      <MdxContent source={content} />
    </LessonLayout>
  );
}