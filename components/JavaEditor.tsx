"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { runJavaInBrowser } from "@/lib/java-runner-browser";
import { Play, RotateCcw, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

interface Props {
  initialCode: string;
  expectedOutput?: string;
  fuzzy?: boolean;
  mustContain?: string[][];
  hints?: string[];
  onSolve?: () => void;
}

type Status = "idle" | "running" | "success" | "error" | "wrong" | "hardcoded";

function normalize(s: string): string {
  return s
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[,!.;]/g, "")          // strip punctuation
    .replace(/\b\w+:\s*/g, "")       // strip label prefixes: "Error: ", "Result: ", "Name: ", etc.
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function passesLogicCheck(code: string, mustContain: string[][]): boolean {
  const lower = code.toLowerCase().replace(/\s+/g, " ");
  return mustContain.every(group => group.some(pat => lower.includes(pat.toLowerCase())));
}

export default function JavaEditor({ initialCode, expectedOutput, fuzzy = false, mustContain, hints = [], onSolve }: Props) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<{ stdout: string; stderr: string } | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const handleRun = useCallback(async () => {
    setStatus("running");
    setResult(null);
    try {
      const res = await runJavaInBrowser(code);
      setResult(res);

      if (res.stderr && res.stderr.trim()) {
        setStatus("error");
      } else if (expectedOutput) {
        const actual = res.stdout.trim().replace(/\r\n/g, "\n");
        const expected = expectedOutput.trim().replace(/\r\n/g, "\n");
        const matches = fuzzy ? normalize(actual) === normalize(expected) : actual === expected;
        if (matches) {
          if (mustContain && !passesLogicCheck(code, mustContain)) {
            setStatus("hardcoded");
          } else {
            setStatus("success");
            onSolve?.();
          }
        } else {
          setStatus("wrong");
        }
      } else {
        setStatus("idle");
      }
    } catch (e) {
      setResult({ stdout: "", stderr: e instanceof Error ? e.message : "Execution failed" });
      setStatus("error");
    }
  }, [code, expectedOutput, fuzzy, mustContain, onSolve]);

  const handleReset = () => {
    setCode(initialCode);
    setResult(null);
    setStatus("idle");
  };

  const isRunning = status === "running";

  return (
    <div className="flex flex-col gap-3">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between rounded-t-xl border border-white/10 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Main.java</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
              isRunning
                ? "bg-orange-500/50 text-orange-200 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
            )}
          >
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="overflow-hidden rounded-b-xl border border-t-0 border-white/10 text-sm">
        <CodeMirrorWrapper code={code} onChange={setCode} />
      </div>

      {/* Success banner */}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          All tests passed!
        </div>
      )}

      {/* Hardcoded warning */}
      {status === "hardcoded" && (
        <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-400">
            <XCircle className="h-4 w-4 shrink-0" />
            Output is correct — but it looks hardcoded
          </div>
          <p className="mt-1 text-xs text-orange-300/70">
            Your program prints the right answer, but it seems like you printed it directly instead of computing it. Try implementing the actual algorithm — that&apos;s where the learning happens!
          </p>
        </div>
      )}

      {/* Error banner */}
      {status === "error" && result?.stderr && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10">
          <div className="flex items-center gap-2 border-b border-red-400/20 px-4 py-2 text-sm font-medium text-red-400">
            <XCircle className="h-4 w-4 shrink-0" />
            Compilation / runtime error
          </div>
          <pre className="overflow-x-auto px-4 py-3 text-xs text-red-300 font-mono whitespace-pre-wrap">{result.stderr}</pre>
        </div>
      )}

      {/* Wrong output — show diff */}
      {status === "wrong" && result && expectedOutput && (
        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5">
          <div className="flex items-center gap-2 border-b border-yellow-400/20 px-4 py-2 text-sm font-medium text-yellow-400">
            <XCircle className="h-4 w-4 shrink-0" />
            Output doesn&apos;t match
          </div>
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-3">
              <div className="mb-1 text-xs font-medium text-gray-500">Expected</div>
              <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap">{expectedOutput.trim()}</pre>
            </div>
            <div className="px-4 py-3">
              <div className="mb-1 text-xs font-medium text-gray-500">Your output</div>
              <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">{result.stdout.trim() || "(no output)"}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Output (when no expected check or hardcoded) */}
      {result && status !== "wrong" && status !== "error" && (
        <div className="rounded-xl border border-white/10 bg-gray-900">
          <div className="border-b border-white/10 px-4 py-2">
            <span className="text-xs font-medium text-gray-400">Output</span>
          </div>
          <pre className="overflow-x-auto px-4 py-3 text-sm text-gray-200 font-mono whitespace-pre-wrap">
            {result.stdout || <span className="text-gray-500">(no output)</span>}
            {result.stderr && <span className="text-red-400">{result.stderr}</span>}
          </pre>
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-gray-900">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              Hints ({hints.length})
            </span>
            {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showHints && (
            <div className="border-t border-white/10 px-4 py-3 space-y-2">
              {hints.slice(0, revealedHints + 1).map((hint, i) => (
                <div key={i} className="flex gap-2 text-sm text-gray-300">
                  <span className="text-orange-400 font-bold shrink-0">{i + 1}.</span>
                  {hint}
                </div>
              ))}
              {revealedHints < hints.length - 1 && (
                <button
                  onClick={() => setRevealedHints((r) => r + 1)}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Show next hint →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeMirrorWrapper({ code, onChange }: { code: string; onChange: (v: string) => void }) {
  const [extensions, setExtensions] = useState<unknown[]>([]);
  const [theme, setTheme] = useState<unknown>(undefined);

  if (typeof window !== "undefined" && extensions.length === 0) {
    Promise.all([
      import("@codemirror/lang-java").then((m) => m.java()),
      import("@codemirror/theme-one-dark").then((m) => m.oneDark),
    ]).then(([javaExt, darkTheme]) => {
      setExtensions([javaExt]);
      setTheme(darkTheme);
    });
  }

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      theme={theme as never}
      extensions={extensions as never}
      style={{ fontSize: "13px" }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
      }}
    />
  );
}
