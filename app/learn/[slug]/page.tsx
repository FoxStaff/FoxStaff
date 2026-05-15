import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonBySlug, lessons } from "@/lib/lessons";
import DifficultyBadge from "@/components/DifficultyBadge";
import LessonClient from "./LessonClient";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const currentIndex = lessons.findIndex((l) => l.slug === slug);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Breadcrumb */}
      <Link href="/learn" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Lessons
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="text-4xl">{lesson.icon}</span>
          <DifficultyBadge level={lesson.difficulty} />
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            {lesson.duration}
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">{lesson.title}</h1>
        <p className="text-gray-400">{lesson.description}</p>
      </div>

      {/* Main content */}
      <LessonClient lesson={lesson} />

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{prev.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        <Link href="/learn" className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">All Lessons</span>
        </Link>

        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:text-white"
          >
            <span className="hidden sm:inline">{next.title}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
