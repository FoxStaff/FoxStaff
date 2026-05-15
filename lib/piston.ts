export interface RunResult {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;
}

export async function runJava(code: string): Promise<RunResult> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Execution service unavailable");
  }

  return {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    code: data.code ?? null,
    signal: data.signal ?? null,
  };
}
