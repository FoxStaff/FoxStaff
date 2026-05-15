"use client";

import { useState } from "react";
import { Lesson } from "@/lib/lessons";
import JavaEditor from "@/components/JavaEditor";
import { BookOpen, Code2, CheckCircle2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "theory" | "practice" | "solution";

// Very simple markdown renderer for our subset of markdown
function TheoryContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="mt-6 mb-3 text-xl font-bold text-white">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="mt-4 mb-2 text-base font-semibold text-gray-200">{line.slice(4)}</h3>);
    } else if (line.startsWith("```")) {
      // Code block
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="my-3 overflow-x-auto rounded-xl bg-gray-900 border border-white/10 p-4 text-sm font-mono text-gray-200 leading-relaxed">
          {codeLines.join("\n")}
        </pre>
      );
    } else if (line.startsWith("| ")) {
      // Table
      const tableLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[-| ]+\|$/));
      elements.push(
        <div key={i} className="my-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").filter((c) => c.trim());
                const isHeader = ri === 0;
                return (
                  <tr key={ri} className={isHeader ? "bg-white/[0.05]" : "border-t border-white/5"}>
                    {cells.map((cell, ci) => (
                      isHeader
                        ? <th key={ci} className="px-4 py-2 text-left font-semibold text-gray-300">{formatInline(cell.trim())}</th>
                        : <td key={ci} className="px-4 py-2 text-gray-400">{formatInline(cell.trim())}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="my-3 space-y-1.5 pl-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-gray-400">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim()) {
      elements.push(<p key={i} className="my-2 text-gray-400 leading-relaxed">{formatInline(line)}</p>);
    }

    i++;
  }

  return <div>{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-orange-300 text-xs">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function LessonClient({ lesson }: { lesson: Lesson }) {
  const [tab, setTab] = useState<Tab>("theory");
  const [solved, setSolved] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "theory", label: "Theory", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Code2 },
    { id: "solution", label: "Solution", icon: Eye },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
              tab === id
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Theory tab */}
      {tab === "theory" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <TheoryContent text={lesson.theory} />
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setTab("practice")}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 active:scale-95 transition-all"
            >
              <Code2 className="h-4 w-4" />
              Try it yourself
            </button>
          </div>
        </div>
      )}

      {/* Practice tab */}
      {tab === "practice" && (
        <div>
          {solved && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Lesson completed! Great work.
            </div>
          )}
          <JavaEditor
            initialCode={lesson.starterCode}
            expectedOutput={lesson.expectedOutput}
            fuzzy
            hints={lesson.hints}
            onSolve={() => setSolved(true)}
          />
        </div>
      )}

      {/* Solution tab */}
      {tab === "solution" && (
        <div className="rounded-2xl border border-white/10 bg-gray-900">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-medium text-gray-400">Solution</span>
            <span className="text-xs text-yellow-400">Try solving it yourself first!</span>
          </div>
          <pre className="overflow-x-auto p-6 text-sm font-mono text-gray-200 leading-relaxed">
            {lesson.solutionCode}
          </pre>
        </div>
      )}
    </div>
  );
}
