// Runs Java source code entirely in the browser using CheerpJ (no API needed).
// First run downloads ~30MB of JVM files from CheerpJ CDN — cached afterwards.

export interface JavaResult {
  stdout: string;
  stderr: string;
}

type CJWindow = Window & typeof globalThis & {
  cheerpjInit: (opts?: Record<string, unknown>) => Promise<void>;
  cheerpjRunMain: (cls: string, cp: string, args?: string[]) => Promise<number>;
  cheerpjAddStringFile: (path: string, content: string) => void;
};

let ready = false;
let readyPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load CheerpJ"));
    document.head.appendChild(s);
  });
}

async function initCheerpJ() {
  if (ready) return;
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    await loadScript("https://cjrtnc.leaningtech.com/3.0/cj3loader.js");
    const cj = window as CJWindow;
    await cj.cheerpjInit({ status: "none" });
    ready = true;
  })();

  return readyPromise;
}

export async function runJavaInBrowser(code: string): Promise<JavaResult> {
  await initCheerpJ();

  const cj = window as CJWindow;
  const filePath = "/str/Main.java";

  // Write source into CheerpJ virtual filesystem
  cj.cheerpjAddStringFile(filePath, code);

  let stdout = "";
  let stderr = "";

  // CheerpJ forwards Java stdout/stderr to console — intercept temporarily
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;
  console.log = (...args: unknown[]) => { stdout += args.join(" ") + "\n"; };
  console.warn = (...args: unknown[]) => { stderr += args.join(" ") + "\n"; };
  console.error = (...args: unknown[]) => { stderr += args.join(" ") + "\n"; };

  try {
    // Step 1: compile with javac
    const compileExit = await cj.cheerpjRunMain(
      "com.sun.tools.javac.Main",
      "/cheerpj/tools.jar:/str",
      ["-d", "/str", filePath]
    );

    if (compileExit !== 0) {
      return { stdout: "", stderr: stderr || "Compilation failed" };
    }

    // Reset — only capture run-phase output
    stdout = "";
    stderr = "";

    // Step 2: run compiled class
    await cj.cheerpjRunMain("Main", "/str");

    return { stdout, stderr };
  } finally {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  }
}
