import Link from "next/link";
import { challenges } from "@/lib/challenges";
import DifficultyBadge from "@/components/DifficultyBadge";
import { Trophy, Star, Filter } from "lucide-react";

const categories = ["All", ...Array.from(new Set(challenges.map((c) => c.category)))];

const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);

export default function ChallengesPage() {
  const easy = challenges.filter((c) => c.difficulty === "Easy");
  const medium = challenges.filter((c) => c.difficulty === "Medium");
  const hard = challenges.filter((c) => c.difficulty === "Hard");

  const groups = [
    { label: "Easy", challenges: easy, color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5", glow: "hover:border-green-500/40" },
    { label: "Medium", challenges: medium, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5", glow: "hover:border-yellow-500/40" },
    { label: "Hard", challenges: hard, color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5", glow: "hover:border-red-500/40" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-400">
          <Trophy className="h-4 w-4" />
          {challenges.length} challenges · {totalPoints} total points
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Challenges</h1>
        <p className="max-w-2xl text-gray-400">
          Put your Java skills to the test. Each challenge runs your code against test cases — pass them all to earn points.
        </p>
      </div>

      {/* Difficulty overview */}
      <div className="mb-12 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        {groups.map(({ label, challenges, color }) => (
          <div key={label} className="text-center">
            <div className={`text-2xl font-bold ${color}`}>{challenges.length}</div>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-xs text-gray-600">{challenges.reduce((s, c) => s + c.points, 0)} pts</div>
          </div>
        ))}
      </div>

      {/* Challenge groups */}
      <div className="flex flex-col gap-12">
        {groups.filter((g) => g.challenges.length > 0).map(({ label, challenges, color, border, bg, glow }) => (
          <div key={label}>
            <div className="mb-5 flex items-center gap-3">
              <h2 className={`text-lg font-bold ${color}`}>{label}</h2>
              <div className={`h-px flex-1 ${border} border-t`} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <Link
                  key={challenge.slug}
                  href={`/challenges/${challenge.slug}`}
                  className={`group rounded-2xl border ${border} ${bg} ${glow} p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-3xl">{challenge.icon}</span>
                    <div className="flex flex-col items-end gap-1.5">
                      <DifficultyBadge level={challenge.difficulty} />
                      <div className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                        <Star className="h-3 w-3" />
                        {challenge.points} pts
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-2 font-semibold text-white group-hover:text-orange-300 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">{challenge.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">{challenge.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {challenge.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
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
