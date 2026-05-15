"use client";

import { useState } from "react";
import { Challenge } from "@/lib/challenges";
import JavaEditor from "@/components/JavaEditor";
import { Eye, EyeOff, CheckCircle2, Star } from "lucide-react";

export default function ChallengeClient({ challenge }: { challenge: Challenge }) {
  const [solved, setSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div>
      {solved && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-green-400">Challenge solved!</div>
            <div className="text-xs text-green-400/70">You earned {challenge.points} points</div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xl font-bold text-orange-400">
            <Star className="h-5 w-5" />
            {challenge.points}
          </div>
        </div>
      )}

      <JavaEditor
        initialCode={challenge.starterCode}
        expectedOutput={challenge.testCases[0]?.expectedOutput}
        mustContain={challenge.mustContain}
        hints={challenge.hints}
        onSolve={() => setSolved(true)}
      />

      <div className="mt-4">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSolution ? "Hide solution" : "Show solution"}
        </button>

        {showSolution && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-gray-900">
            <div className="border-b border-white/10 px-4 py-3">
              <span className="text-sm font-medium text-gray-400">Solution</span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm font-mono text-gray-200 leading-relaxed">
              {challenge.solutionCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
