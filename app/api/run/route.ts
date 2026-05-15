import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "java",
        version: "*",
        files: [{ name: "Main.java", content: code }],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
      }),
    });

    if (!res.ok) throw new Error("upstream error");

    const data = await res.json();
    return NextResponse.json({
      stdout: data.run?.stdout ?? "",
      stderr: (data.compile?.stderr ?? "") + (data.run?.stderr ?? ""),
      code: data.run?.code ?? null,
      signal: data.run?.signal ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Execution service unavailable" },
      { status: 502 }
    );
  }
}
