import { notFound } from "next/navigation";
import Link from "next/link";
import { getChallengeBySlug, challenges } from "@/lib/challenges";
import DifficultyBadge from "@/components/DifficultyBadge";
import ChallengeClient from "./ChallengeClient";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);
  if (!challenge) notFound();

  const currentIndex = challenges.findIndex((c) => c.slug === slug);
  const next = currentIndex < challenges.length - 1 ? challenges[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Breadcrumb */}
      <Link href="/challenges" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Challenges
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="text-4xl">{challenge.icon}</span>
          <DifficultyBadge level={challenge.difficulty} />
          <div className="flex items-center gap-1 text-sm font-semibold text-orange-400">
            <Star className="h-4 w-4" />
            {challenge.points} points
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-gray-400">
            {challenge.category}
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">{challenge.title}</h1>
        <p className="text-gray-400">{challenge.description}</p>
      </div>

      {/* Test cases preview */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          Test Cases
        </h3>
        <div className="flex flex-col gap-3">
          {challenge.testCases.map((tc, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-2 text-xs font-medium text-gray-500">{tc.description}</div>
              <div className="font-mono text-xs text-gray-300">
                <span className="text-gray-600">Expected: </span>
                <span className="text-green-400">{tc.expectedOutput.slice(0, 80)}{tc.expectedOutput.length > 80 ? "..." : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge editor */}
      <ChallengeClient challenge={challenge} />

      {/* Next challenge */}
      {next && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="mb-3 text-sm text-gray-500">Next challenge</p>
          <Link
            href={`/challenges/${next.slug}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{next.icon}</span>
              <div>
                <div className="font-medium text-white">{next.title}</div>
                <div className="text-xs text-gray-500">{next.category} · {next.points} pts</div>
              </div>
            </div>
            <DifficultyBadge level={next.difficulty} />
          </Link>
        </div>
      )}
    </div>
  );
}
