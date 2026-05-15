export interface RunResult {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;
}

export async function runJava(code: string): Promise<RunResult> {
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

  if (!res.ok) throw new Error("Execution service unavailable");

  const data = await res.json();
  return {
    stdout: data.run?.stdout ?? "",
    stderr: (data.compile?.stderr ?? "") + (data.run?.stderr ?? ""),
    code: data.run?.code ?? null,
    signal: data.run?.signal ?? null,
  };
}
