import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function tryJDoodle(code: string) {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("not configured");
  const res = await fetch("https://api.jdoodle.com/v1/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret, script: code, language: "java", versionIndex: "4" }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json() as { output?: string; error?: string };
  if (data.error) throw new Error(data.error);
  return { stdout: data.output ?? "", stderr: "" };
}

async function tryPiston(code: string) {
  const res = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "java", version: "*",
      files: [{ name: "Main.java", content: code }],
      stdin: "", args: [], compile_timeout: 10000, run_timeout: 5000,
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json() as { message?: string; run?: { stdout: string }; compile?: { stderr: string } };
  if (data.message) throw new Error(data.message);
  return {
    stdout: data.run?.stdout ?? "",
    stderr: data.compile?.stderr ?? "",
  };
}

export async function POST(req: NextRequest) {
  const { code } = await req.json() as { code: string };
  const errors: string[] = [];

  for (const [name, fn] of [
    ["JDoodle", () => tryJDoodle(code)],
    ["Piston", () => tryPiston(code)],
  ] as const) {
    try {
      const result = await fn();
      return NextResponse.json({ ...result, code: 0, signal: null });
    } catch (e) {
      errors.push(`${name}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  return NextResponse.json(
    { error: `Services unavailable — ${errors.join(" | ")}` },
    { status: 502 }
  );
}
