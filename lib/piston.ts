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

  if (!res.ok) throw new Error("Execution service unavailable");

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  return {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    code: data.code ?? null,
    signal: data.signal ?? null,
  };
}
