import Link from "next/link";
import { lessons } from "@/lib/lessons";
import DifficultyBadge from "@/components/DifficultyBadge";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export default function LearnPage() {
  const beginner = lessons.filter((l) => l.difficulty === "Beginner");
  const intermediate = lessons.filter((l) => l.difficulty === "Intermediate");
  const advanced = lessons.filter((l) => l.difficulty === "Advanced");

  const groups = [
    { title: "Beginner", lessons: beginner, color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5" },
    { title: "Intermediate", lessons: intermediate, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5" },
    { title: "Advanced", lessons: advanced, color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-400">
          <BookOpen className="h-4 w-4" />
          {lessons.length} lessons
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Learn Java</h1>
        <p className="max-w-2xl text-gray-400">
          A structured path from the basics to advanced Java. Each lesson includes theory, examples, and an interactive editor to practice right in your browser.
        </p>
      </div>

      {/* Progress overview */}
      <div className="mb-12 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        {groups.map(({ title, lessons, color }) => (
          <div key={title} className="text-center">
            <div className={`text-2xl font-bold ${color}`}>{lessons.length}</div>
            <div className="text-sm text-gray-500">{title}</div>
          </div>
        ))}
      </div>

      {/* Lesson groups */}
      <div className="flex flex-col gap-12">
        {groups.filter((g) => g.lessons.length > 0).map(({ title, lessons, color, border, bg }) => (
          <div key={title}>
            <div className="mb-5 flex items-center gap-3">
              <h2 className={`text-lg font-bold ${color}`}>{title}</h2>
              <div className={`h-px flex-1 ${border} border-t`} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson, i) => (
                <Link
                  key={lesson.slug}
                  href={`/learn/${lesson.slug}`}
                  className={`group relative rounded-2xl border ${border} ${bg} p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  {/* Lesson number */}
                  <div className="absolute right-4 top-4 text-xs font-mono text-gray-600">
                    #{i + 1}
                  </div>

                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{lesson.icon}</span>
                    <DifficultyBadge level={lesson.difficulty} />
                  </div>

                  <h3 className="mb-2 font-semibold text-white group-hover:text-orange-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">{lesson.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lesson.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
