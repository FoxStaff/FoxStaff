import Link from "next/link";
import { BookOpen, Trophy, Terminal, ArrowRight, Code2, Zap, Target, Users } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { challenges } from "@/lib/challenges";
import DifficultyBadge from "@/components/DifficultyBadge";

const stats = [
  { label: "Lessons", value: lessons.length, icon: BookOpen },
  { label: "Challenges", value: challenges.length, icon: Trophy },
  { label: "Java Topics", value: "15+", icon: Code2 },
  { label: "Free Forever", value: "100%", icon: Zap },
];

const features = [
  {
    icon: Terminal,
    title: "Built-in Java Runner",
    description: "Write and execute real Java code directly in your browser. No setup, no downloads — just code.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Target,
    title: "Hands-on Challenges",
    description: "Test your knowledge with progressively harder challenges across algorithms, data structures, and OOP.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Follow a carefully designed curriculum from Hello World to advanced Java concepts.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Users,
    title: "Mobile Friendly",
    description: "Learn on any device. The editor and all features are fully optimized for phones and tablets.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

export default function HomePage() {
  const featuredLessons = lessons.slice(0, 3);
  const featuredChallenges = challenges.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400">
            <Zap className="h-4 w-4" />
            Run Java code right in your browser
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Learn Java the
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"> right way</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
            Interactive lessons, real code execution, and hands-on challenges — everything you need to go from beginner to confident Java developer.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/learn"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95"
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/challenges"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
            >
              Try Challenges
              <Trophy className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/[0.02] px-4 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                <Icon className="h-5 w-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
            Everything you need to master Java
          </h2>
          <p className="mb-12 text-center text-gray-500">No fluff, no paywalls — just great learning tools.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05]">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lessons */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Lessons</h2>
              <p className="text-sm text-gray-500">Start from the basics and build your way up</p>
            </div>
            <Link href="/learn" className="flex items-center gap-1 text-sm font-medium text-orange-400 hover:text-orange-300">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredLessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/learn/${lesson.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-orange-500/30 hover:bg-orange-500/[0.05]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl">{lesson.icon}</span>
                  <DifficultyBadge level={lesson.difficulty} />
                </div>
                <h3 className="mb-1 font-semibold text-white group-hover:text-orange-300 transition-colors">{lesson.title}</h3>
                <p className="mb-4 text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{lesson.duration}</span>
                  <span>·</span>
                  <span>{lesson.tags.slice(0, 2).join(", ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Popular Challenges</h2>
              <p className="text-sm text-gray-500">Test your skills with real problems</p>
            </div>
            <Link href="/challenges" className="flex items-center gap-1 text-sm font-medium text-orange-400 hover:text-orange-300">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredChallenges.map((challenge) => (
              <Link
                key={challenge.slug}
                href={`/challenges/${challenge.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-blue-500/30 hover:bg-blue-500/[0.05]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl">{challenge.icon}</span>
                  <div className="flex flex-col items-end gap-1">
                    <DifficultyBadge level={challenge.difficulty} />
                    <span className="text-xs text-orange-400 font-medium">{challenge.points} pts</span>
                  </div>
                </div>
                <h3 className="mb-1 font-semibold text-white group-hover:text-blue-300 transition-colors">{challenge.title}</h3>
                <p className="mb-4 text-sm text-gray-500 line-clamp-2">{challenge.description}</p>
                <span className="text-xs font-medium text-gray-600">{challenge.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-10">
            <h2 className="mb-4 text-3xl font-bold text-white">Ready to start?</h2>
            <p className="mb-8 text-gray-400">
              Join thousands of learners mastering Java — free, interactive, and right in your browser.
            </p>
            <Link
              href="/learn/hello-world"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 active:scale-95"
            >
              Write Your First Java Program
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
