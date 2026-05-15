import { cn } from "@/lib/utils";

const styles = {
  Beginner: "bg-green-500/15 text-green-400 border-green-500/20",
  Easy: "bg-green-500/15 text-green-400 border-green-500/20",
  Intermediate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Advanced: "bg-red-500/15 text-red-400 border-red-500/20",
  Hard: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[level as keyof typeof styles] ?? "bg-gray-500/15 text-gray-400 border-gray-500/20")}>
      {level}
    </span>
  );
}
