// Transpiles a Java subset to JavaScript and evaluates it in-browser.
// Handles all patterns used in this learning site — no download, no API.

export interface JavaResult {
  stdout: string;
  stderr: string;
}

export async function runJavaInBrowser(source: string): Promise<JavaResult> {
  try {
    const output = executeJava(source);
    return { stdout: output, stderr: "" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Prettify common errors
    return { stdout: "", stderr: msg.replace(/^Error:\s*/,"") };
  }
}

// ─── Execution ────────────────────────────────────────────────────────────────

function executeJava(source: string): string {
  let out = "";
  const print  = (v: unknown) => { out += toStr(v); };
  const println = (v: unknown) => { out += toStr(v) + "\n"; };

  // Build JS source from Java source
  const js = transpile(source);

  try {
    // eslint-disable-next-line no-new-func
    new Function(
      "__println", "__print", "__ArrayList", "__HashMap",
      "__StringBuilder", "__Arrays", "__Collections", "__Integer",
      "__Double", "__Long", "__Character", "__String", "__Math",
      js
    )(
      println, print, __ArrayList, __HashMap,
      __StringBuilder, __Arrays, __Collections, __Integer,
      __Double, __Long, __Character, __String, JavaMath
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(msg);
  }

  return out;
}

// ─── Transpiler ───────────────────────────────────────────────────────────────

function transpile(source: string): string {
  let s = stripComments(source);
  s = stripImports(s);
  s = stripAnnotations(s);
  s = stripGenerics(s);

  // Extract outer class body
  const classBody = extractOuterClassBody(s);

  // Collect all inner static classes and top-level methods
  const innerClasses = extractInnerClasses(classBody);
  const methods = extractMethods(classBody);

  const parts: string[] = [];

  // JS class definitions for inner Java classes
  for (const ic of innerClasses) {
    parts.push(transpileClass(ic));
  }

  // JS functions for static methods
  for (const m of methods) {
    if (m.name !== "main") {
      parts.push(transpileMethod(m));
    }
  }

  // main body
  const mainMethod = methods.find((m) => m.name === "main");
  if (!mainMethod) throw new Error("No main method found");
  parts.push(transpileBody(mainMethod.body));

  return parts.join("\n\n");
}

// ─── Strippers ────────────────────────────────────────────────────────────────

function stripComments(s: string): string {
  // Block comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, " ");
  // Line comments (but not inside strings)
  s = s.replace(/\/\/[^\n]*/g, "");
  return s;
}

function stripImports(s: string): string {
  return s.replace(/^\s*import\s+[^;]+;\s*/gm, "");
}

function stripAnnotations(s: string): string {
  return s.replace(/@\w+(\([^)]*\))?\s*/g, "");
}

function stripGenerics(s: string): string {
  // Remove simple generics like <String>, <Integer, String>, etc.
  return s.replace(/<\s*[\w\s,\[\]?&|.]+\s*>/g, "");
}

// ─── Structure extractors ─────────────────────────────────────────────────────

function extractOuterClassBody(s: string): string {
  const m = s.match(/(?:public\s+)?class\s+\w+(?:\s+extends\s+\w+)?\s*\{([\s\S]*)\}\s*$/);
  if (!m) throw new Error("Could not find class definition");
  return m[1];
}

interface MethodInfo {
  name: string;
  params: string;
  body: string;
  returnType: string;
}

interface ClassInfo {
  name: string;
  parent: string | null;
  body: string;
}

function extractInnerClasses(s: string): ClassInfo[] {
  const classes: ClassInfo[] = [];
  const re = /(?:static\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const name = m[1];
    const parent = m[2] ?? null;
    const body = extractBlock(s, m.index + m[0].length - 1);
    classes.push({ name, parent, body });
  }
  return classes;
}

function extractMethods(s: string): MethodInfo[] {
  const methods: MethodInfo[] = [];
  // Match static or non-static method declarations
  const re = /(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:final\s+)?(\w[\w\[\]]*)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w,\s]+)?\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const returnType = m[1];
    const name = m[2];
    // skip class definitions caught by this pattern
    if (["class", "interface", "enum"].includes(returnType)) continue;
    if (["if", "while", "for", "switch", "try", "catch"].includes(name)) continue;
    const params = m[3].trim();
    const bodyStart = m.index + m[0].length - 1;
    const body = extractBlock(s, bodyStart);
    methods.push({ name, params, body, returnType });
  }
  return methods;
}

/** Given position of opening '{', return the content inside the matching '}' */
function extractBlock(s: string, openBrace: number): string {
  let depth = 0;
  let i = openBrace;
  const start = i + 1;
  while (i < s.length) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return s.slice(start, i);
    }
    i++;
  }
  return s.slice(start);
}

// ─── Code generators ─────────────────────────────────────────────────────────

function transpileClass(ic: ClassInfo): string {
  const methods = extractMethods(ic.body);
  const fields = extractFields(ic.body);
  const ctor = extractConstructor(ic.name, ic.body);

  const fieldInits = fields.map((f) => `    this.${f.name} = ${transpileExpr(f.init)};`).join("\n");

  let ctorBody = "";
  if (ctor) {
    // Replace super() calls
    let body = ctor.body;
    body = body.replace(/super\s*\(([^)]*)\)/g, (_, args) => `super(${transpileExprList(args)})`);
    ctorBody = transpileBody(body);
  }

  const methodDefs = methods
    .filter((m) => m.name !== ic.name)
    .map((m) => {
      const params = transpileParams(m.params);
      const body = transpileBody(m.body);
      return `  ${m.name}(${params}) {\n${indent(body)}\n  }`;
    })
    .join("\n\n");

  const ext = ic.parent ? ` extends ${ic.parent}` : "";

  return `class ${ic.name}${ext} {
  constructor(...__args) {
${indent(ic.parent ? `super(...__args.slice(0, ${ctor ? ctorParamCount(ctor.params) : 0}));` : "")}
${indent(fieldInits)}
${indent(ctorBody)}
  }
${methodDefs}
}`;
}

function ctorParamCount(params: string): number {
  return params ? params.split(",").length : 0;
}

interface FieldInfo { name: string; init: string; }

function extractFields(body: string): FieldInfo[] {
  const fields: FieldInfo[] = [];
  // Match simple field declarations (not inside methods)
  const re = /(?:(?:private|public|protected)\s+)?(?:static\s+)?(?:final\s+)?(?:\w[\w\[\]]*)\s+(\w+)\s*=\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    // Crude check: if preceded by a method signature in same block, skip
    fields.push({ name: m[1], init: m[2].trim() });
  }
  return fields;
}

interface CtorInfo { params: string; body: string; }

function extractConstructor(className: string, body: string): CtorInfo | null {
  const re = new RegExp(`(?:public\\s+)?${className}\\s*\\(([^)]*)\\)\\s*\\{`);
  const m = body.match(re);
  if (!m) return null;
  const start = (m.index ?? 0) + m[0].length - 1;
  return { params: m[1], body: extractBlock(body, start) };
}

function transpileMethod(m: MethodInfo): string {
  const params = transpileParams(m.params);
  const body = transpileBody(m.body);
  return `function ${m.name}(${params}) {\n${indent(body)}\n}`;
}

function transpileParams(params: string): string {
  if (!params.trim()) return "";
  return params
    .split(",")
    .map((p) => {
      const parts = p.trim().split(/\s+/);
      return parts[parts.length - 1].replace(/\[\]$/, "");
    })
    .join(", ");
}

// ─── Statement transpiler ─────────────────────────────────────────────────────

function transpileBody(body: string): string {
  const stmts = splitStatements(body.trim());
  return stmts.map(transpileStatement).filter(Boolean).join("\n");
}

function transpileStatement(s: string): string {
  s = s.trim();
  if (!s) return "";

  // Block: { ... }
  if (s.startsWith("{") && s.endsWith("}")) {
    return "{\n" + indent(transpileBody(s.slice(1, -1))) + "\n}";
  }

  // if / else if / else
  if (/^if\s*\(/.test(s)) return transpileIf(s);

  // while
  if (/^while\s*\(/.test(s)) {
    const { cond, rest } = extractCondAndBody(s, "while");
    return `while (${transpileExpr(cond)}) ${transpileStatement(rest)}`;
  }

  // do-while
  if (/^do\s*\{/.test(s)) {
    const braceEnd = findBlockEnd(s, s.indexOf("{"));
    const blockBody = s.slice(s.indexOf("{") + 1, braceEnd);
    const whilePart = s.slice(braceEnd + 1).trim();
    const condMatch = whilePart.match(/^while\s*\((.+)\)\s*;?/);
    const cond = condMatch ? condMatch[1] : "true";
    return `do {\n${indent(transpileBody(blockBody))}\n} while (${transpileExpr(cond)});`;
  }

  // for loop (enhanced or classic)
  if (/^for\s*\(/.test(s)) return transpileFor(s);

  // try-catch-finally
  if (/^try\s*\{/.test(s)) return transpileTryCatch(s);

  // throw
  if (/^throw\s+/.test(s)) {
    return `throw new Error(${transpileExpr(s.replace(/^throw\s+new\s+\w+\s*\(/, "").replace(/\)\s*;?$/, ""))});`;
  }

  // return
  if (/^return(\s|;)/.test(s)) {
    const expr = s.replace(/^return\s*/, "").replace(/;$/, "").trim();
    return expr ? `return ${transpileExpr(expr)};` : "return;";
  }

  // Variable declaration with assignment
  const varDecl = s.match(/^(?:final\s+)?(?:int|double|float|long|boolean|char|byte|short|String|var)\s*(?:\[\])?\s+(\w+)\s*=\s*([\s\S]+?);?$/);
  if (varDecl) {
    return `let ${varDecl[1]} = ${transpileExpr(varDecl[2].replace(/;$/, ""))};`;
  }

  // Array declaration: int[] arr = new int[n]; or int[] arr = {1,2,3};
  const arrDecl = s.match(/^(?:int|double|float|long|String|boolean|char)\s*\[\]\s+(\w+)\s*=\s*([\s\S]+?);?$/);
  if (arrDecl) {
    const init = arrDecl[2].replace(/;$/, "").trim();
    const jsInit = init.startsWith("new ")
      ? `new Array(${transpileExpr(init.replace(/new\s+\w+\[\s*/, "").replace(/\s*\]/, ""))}).fill(${defaultForType(s)})`
      : transpileExpr(init);
    return `let ${arrDecl[1]} = ${jsInit};`;
  }

  // Object/class variable declaration: ArrayList list = new ArrayList();
  const objDecl = s.match(/^(?:\w+)\s+(\w+)\s*=\s*([\s\S]+?);?$/);
  if (objDecl && !s.includes("(") === false) {
    const name = objDecl[1];
    const init = objDecl[2].replace(/;$/, "").trim();
    return `let ${name} = ${transpileExpr(init)};`;
  }

  // System.out.println / print
  if (/^System\.out\.println\s*\(/.test(s)) {
    const arg = extractCallArg(s, "System.out.println");
    return `__println(${transpileExpr(arg)});`;
  }
  if (/^System\.out\.print\s*\(/.test(s)) {
    const arg = extractCallArg(s, "System.out.print");
    return `__print(${transpileExpr(arg)});`;
  }

  // Assignment (augmented or plain)
  if (/^\w[\w.]*\s*[\+\-\*\/\%]?=/.test(s) && !s.startsWith("==")) {
    return `${transpileExpr(s.replace(/;$/, ""))};`;
  }

  // Increment / decrement
  if (/^[\w\[\].]+(\+\+|--)$/.test(s.replace(/;$/, "")) || /^(\+\+|--)[\w\[\].]+$/.test(s.replace(/;$/, ""))) {
    return `${transpileExpr(s.replace(/;$/, ""))};`;
  }

  // Expression statement (method call, etc.)
  return `${transpileExpr(s.replace(/;$/, ""))};`;
}

function transpileIf(s: string): string {
  const { cond, rest } = extractCondAndBody(s, "if");
  let js = `if (${transpileExpr(cond)}) ${transpileStatement(rest)}`;

  // Consume else-if / else
  let tail = rest;
  // Find end of block
  if (tail.startsWith("{")) {
    tail = s.slice(s.indexOf("{") + 1 + findBlockEnd(s.slice(s.indexOf("{")), 0));
  }
  // The 'rest' after the if-block is the else part
  // We need to look after the body for else
  const afterBody = getAfterBody(s);
  const elseMatch = afterBody.match(/^(\s*else\s+if\s*\([\s\S]+|\s*else\s*\{[\s\S]*|\s*else\s+[\s\S]*)/);
  if (elseMatch) {
    js += " " + transpileStatement(elseMatch[1].trim());
  }
  return js;
}

function getAfterBody(s: string): string {
  const condEnd = s.indexOf("(") + 1;
  let depth = 1;
  let i = condEnd;
  while (i < s.length && depth > 0) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") depth--;
    i++;
  }
  const body = s.slice(i).trim();
  if (body.startsWith("{")) {
    const end = findBlockEnd(body, 0);
    return body.slice(end + 1);
  }
  // single-statement body
  const sc = body.indexOf(";");
  return sc >= 0 ? body.slice(sc + 1) : "";
}

function transpileFor(s: string): string {
  // Extract condition
  const parenStart = s.indexOf("(");
  const parenContent = extractParen(s, parenStart);
  const bodyStart = parenStart + parenContent.length + 2;
  const body = s.slice(bodyStart).trim();

  // Enhanced for: for (Type x : iterable)
  const enhanced = parenContent.match(/^(?:\w[\w\[\]]*\s+)?(\w+)\s*:\s*([\s\S]+)$/);
  if (enhanced) {
    const varName = enhanced[1];
    const iterable = transpileExpr(enhanced[2].trim());
    return `for (let ${varName} of ${iterable}) ${transpileStatement(body)}`;
  }

  // Classic for
  const parts = splitForParts(parenContent);
  const init  = parts[0] ? transpileStatement(parts[0]).replace(/;$/, "") : "";
  const cond  = parts[1] ? transpileExpr(parts[1].trim()) : "";
  const update = parts[2] ? transpileExpr(parts[2].trim()) : "";
  return `for (${init}; ${cond}; ${update}) ${transpileStatement(body)}`;
}

function splitForParts(s: string): [string, string, string] {
  // Split on first two semicolons (not inside parens/strings)
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === ";" && depth === 0) { parts.push(cur); cur = ""; continue; }
    cur += ch;
  }
  parts.push(cur);
  return [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""] as [string, string, string];
}

function transpileTryCatch(s: string): string {
  const tryBrace = s.indexOf("{");
  const tryBlock = extractBlock(s, tryBrace);
  let rest = s.slice(tryBrace + tryBlock.length + 2).trim();

  let catchClause = "";
  let finallyClause = "";

  if (rest.startsWith("catch")) {
    const catchParen = extractParen(rest, rest.indexOf("("));
    const catchBrace = rest.indexOf("{", rest.indexOf(")"));
    const catchBlock = extractBlock(rest, catchBrace);
    const errVar = catchParen.split(/\s+/).pop() ?? "e";
    catchClause = ` catch (__e) {\nlet ${errVar} = { getMessage: () => __e.message, toString: () => __e.message };\n${indent(transpileBody(catchBlock))}\n}`;
    rest = rest.slice(catchBrace + catchBlock.length + 2).trim();
  }

  if (rest.startsWith("finally")) {
    const finallyBrace = rest.indexOf("{");
    const finallyBlock = extractBlock(rest, finallyBrace);
    finallyClause = ` finally {\n${indent(transpileBody(finallyBlock))}\n}`;
  }

  return `try {\n${indent(transpileBody(tryBlock))}\n}${catchClause}${finallyClause}`;
}

// ─── Expression transpiler ────────────────────────────────────────────────────

function transpileExpr(s: string): string {
  s = s.trim();
  if (!s) return s;

  // Multi-line (shouldn't happen in exprs but just in case)
  s = s.replace(/\s+/g, " ");

  // String / char literals — preserve them
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s;

  // null / true / false
  if (s === "null") return "null";
  if (s === "true") return "true";
  if (s === "false") return "false";

  // Numeric literal
  if (/^-?\d+(\.\d+)?[fFdDlL]?$/.test(s)) return s.replace(/[fFdDlL]$/, "");

  // Cast: (int) expr, (double) expr — simplified
  const castMatch = s.match(/^\((int|double|float|long|char|byte|short|String)\)\s*(.+)$/);
  if (castMatch) {
    const type = castMatch[1];
    const inner = transpileExpr(castMatch[2]);
    if (type === "int" || type === "byte" || type === "short") return `Math.trunc(${inner})`;
    if (type === "char") return `String.fromCharCode(${inner})`;
    if (type === "String") return `String(${inner})`;
    return inner;
  }

  // instanceof
  if (/\binstanceof\b/.test(s)) {
    const [left, right] = s.split(/\s+instanceof\s+/);
    return `(${transpileExpr(left)} instanceof ${right.trim()})`;
  }

  // Ternary — very basic
  const ternary = splitTernary(s);
  if (ternary) {
    return `(${transpileExpr(ternary[0])} ? ${transpileExpr(ternary[1])} : ${transpileExpr(ternary[2])})`;
  }

  // new expressions
  if (/^new\s+/.test(s)) return transpileNew(s);

  // Method chains / calls
  s = transpileCalls(s);

  return s;
}

function transpileExprList(s: string): string {
  return s.split(",").map((e) => transpileExpr(e.trim())).join(", ");
}

function transpileNew(s: string): string {
  const m = s.match(/^new\s+(\w+)\s*\(([^)]*)\)/);
  if (!m) return s;
  const cls = m[1];
  const args = m[2].trim();
  const factories: Record<string, string> = {
    ArrayList: "__ArrayList.create",
    HashMap: "__HashMap.create",
    StringBuilder: "__StringBuilder.create",
    HashSet: "__ArrayList.create",
    LinkedList: "__ArrayList.create",
    Stack: "__ArrayList.create",
  };
  if (factories[cls]) return `${factories[cls]}()`;
  return args ? `new ${cls}(${transpileExprList(args)})` : `new ${cls}()`;
}

function transpileCalls(s: string): string {
  // System.out.println/print
  s = s.replace(/System\.out\.println\s*\(([^)]*)\)/g, (_, a) => `__println(${transpileExpr(a)})`);
  s = s.replace(/System\.out\.print\s*\(([^)]*)\)/g, (_, a) => `__print(${transpileExpr(a)})`);

  // Math functions
  s = s.replace(/\bMath\./g, "__Math.");

  // String methods: .equals() → ===, .equalsIgnoreCase()
  s = s.replace(/(\w+)\.equals\s*\(([^)]+)\)/g, (_, a, b) => `(${a} === ${transpileExpr(b)})`);
  s = s.replace(/(\w+)\.equalsIgnoreCase\s*\(([^)]+)\)/g, (_, a, b) => `(${a}.toLowerCase() === ${transpileExpr(b)}.toLowerCase())`);

  // String → __String wrapper calls
  s = s.replace(/(\w+)\.toCharArray\s*\(\)/g, "__String.toCharArray($1)");
  s = s.replace(/(\w+)\.charAt\s*\(([^)]+)\)/g, "$1[$2]");
  s = s.replace(/(\w+)\.length\s*\(\)/g, "$1.length");
  s = s.replace(/(\w+)\.toLowerCase\s*\(\)/g, "$1.toLowerCase()");
  s = s.replace(/(\w+)\.toUpperCase\s*\(\)/g, "$1.toUpperCase()");
  s = s.replace(/(\w+)\.trim\s*\(\)/g, "$1.trim()");
  s = s.replace(/(\w+)\.substring\s*\(([^)]+)\)/g, "$1.slice($2)");
  s = s.replace(/(\w+)\.indexOf\s*\(([^)]+)\)/g, "__String.indexOf($1, $2)");
  s = s.replace(/(\w+)\.contains\s*\(([^)]+)\)/g, "$1.includes($2)");
  s = s.replace(/(\w+)\.startsWith\s*\(([^)]+)\)/g, "$1.startsWith($2)");
  s = s.replace(/(\w+)\.endsWith\s*\(([^)]+)\)/g, "$1.endsWith($2)");
  s = s.replace(/(\w+)\.replace\s*\(([^)]+)\)/g, "$1.replace($2)");
  s = s.replace(/(\w+)\.split\s*\(([^)]+)\)/g, "$1.split($2)");

  // ArrayList/array methods
  s = s.replace(/(\w+)\.add\s*\(([^)]+)\)/g, "__ArrayList.add($1, $2)");
  s = s.replace(/(\w+)\.remove\s*\(([^)]+)\)/g, "__ArrayList.remove($1, $2)");
  s = s.replace(/(\w+)\.get\s*\(([^)]+)\)/g, "$1[$2]");
  s = s.replace(/(\w+)\.set\s*\(([^)]+),\s*([^)]+)\)/g, "($1[$2] = $3)");
  s = s.replace(/(\w+)\.size\s*\(\)/g, "$1.length");
  s = s.replace(/(\w+)\.isEmpty\s*\(\)/g, "($1.length === 0)");

  // HashMap
  s = s.replace(/(\w+)\.put\s*\(([^)]+),\s*([^)]+)\)/g, "__HashMap.put($1, $2, $3)");
  s = s.replace(/(\w+)\.get\s*\(([^)]+)\)/g, "__HashMap.get($1, $2)");
  s = s.replace(/(\w+)\.getOrDefault\s*\(([^)]+),\s*([^)]+)\)/g, "__HashMap.getOrDefault($1, $2, $3)");
  s = s.replace(/(\w+)\.containsKey\s*\(([^)]+)\)/g, "__HashMap.containsKey($1, $2)");
  s = s.replace(/(\w+)\.keySet\s*\(\)/g, "__HashMap.keySet($1)");
  s = s.replace(/(\w+)\.values\s*\(\)/g, "Object.values($1)");

  // Collections
  s = s.replace(/Collections\.sort\s*\(([^)]+)\)/g, "__Collections.sort($1)");
  s = s.replace(/Collections\.reverse\s*\(([^)]+)\)/g, "$1.reverse()");

  // Arrays
  s = s.replace(/Arrays\.sort\s*\(([^)]+)\)/g, "__Arrays.sort($1)");
  s = s.replace(/Arrays\.equals\s*\(([^)]+),\s*([^)]+)\)/g, "__Arrays.equals($1, $2)");
  s = s.replace(/Arrays\.toString\s*\(([^)]+)\)/g, "__Arrays.toString($1)");

  // StringBuilder
  s = s.replace(/(\w+)\.append\s*\(([^)]+)\)/g, "__StringBuilder.append($1, $2)");
  s = s.replace(/(\w+)\.reverse\s*\(\)/g, "__StringBuilder.reverse($1)");
  s = s.replace(/(\w+)\.toString\s*\(\)/g, "__StringBuilder.toString($1)");

  // parseInt, parseDouble, valueOf
  s = s.replace(/Integer\.parseInt\s*\(([^)]+)\)/g, "parseInt($1, 10)");
  s = s.replace(/Double\.parseDouble\s*\(([^)]+)\)/g, "parseFloat($1)");
  s = s.replace(/Integer\.valueOf\s*\(([^)]+)\)/g, "parseInt($1, 10)");
  s = s.replace(/Integer\.MAX_VALUE/g, "2147483647");
  s = s.replace(/Integer\.MIN_VALUE/g, "-2147483648");
  s = s.replace(/String\.valueOf\s*\(([^)]+)\)/g, "String($1)");
  s = s.replace(/Character\.toLowerCase\s*\(([^)]+)\)/g, "$1.toLowerCase()");

  // "aeiou".indexOf → __String.indexOf
  return s;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function splitStatements(s: string): string[] {
  const stmts: string[] = [];
  let depth = 0;
  let i = 0;
  let cur = "";
  let inStr = false;
  let strChar = "";

  while (i < s.length) {
    const ch = s[i];

    if (inStr) {
      cur += ch;
      if (ch === strChar && s[i - 1] !== "\\") inStr = false;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") { inStr = true; strChar = ch; cur += ch; i++; continue; }

    if (ch === "{" || ch === "(") depth++;
    else if (ch === "}" || ch === ")") depth--;

    if (ch === "}" && depth === 0) {
      cur += ch;
      // Don't split here if catch/finally follows — keep try-catch as one statement
      const ahead = s.slice(i + 1).trimStart();
      if (!ahead.startsWith("catch") && !ahead.startsWith("finally")) {
        stmts.push(cur.trim());
        cur = "";
      }
      i++;
      continue;
    }

    if (ch === ";" && depth === 0) {
      cur = cur.trim();
      if (cur) stmts.push(cur + ";");
      cur = "";
      i++;
      continue;
    }

    cur += ch;
    i++;
  }
  if (cur.trim()) stmts.push(cur.trim());
  return stmts.filter(Boolean);
}

function extractCondAndBody(s: string, keyword: string): { cond: string; rest: string } {
  const start = s.indexOf("(", keyword.length);
  const cond = extractParen(s, start);
  const rest = s.slice(start + cond.length + 2).trim();
  return { cond, rest };
}

function extractParen(s: string, start: number): string {
  let depth = 0;
  let i = start;
  const from = i + 1;
  while (i < s.length) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") { depth--; if (depth === 0) return s.slice(from, i); }
    i++;
  }
  return s.slice(from);
}

function findBlockEnd(s: string, openBrace: number): number {
  let depth = 0;
  let i = openBrace;
  while (i < s.length) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") { depth--; if (depth === 0) return i; }
    i++;
  }
  return i;
}

function extractCallArg(s: string, methodName: string): string {
  const start = s.indexOf("(", methodName.length);
  return extractParen(s, start);
}

function splitTernary(s: string): [string, string, string] | null {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "?" && depth === 0) {
      const cond = s.slice(0, i).trim();
      const rest = s.slice(i + 1);
      let d2 = 0;
      for (let j = 0; j < rest.length; j++) {
        if (rest[j] === "(" || rest[j] === "[") d2++;
        else if (rest[j] === ")" || rest[j] === "]") d2--;
        else if (rest[j] === ":" && d2 === 0) {
          return [cond, rest.slice(0, j).trim(), rest.slice(j + 1).trim()];
        }
      }
    }
  }
  return null;
}

function defaultForType(decl: string): string {
  if (decl.includes("int") || decl.includes("long") || decl.includes("double") || decl.includes("float")) return "0";
  if (decl.includes("boolean")) return "false";
  return "null";
}

function indent(s: string, n = 2): string {
  return s.split("\n").map((l) => " ".repeat(n) + l).join("\n");
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (Array.isArray(v)) return "[" + v.join(", ") + "]";
  if (typeof v === "boolean") return String(v);
  if (typeof v === "number") {
    // Java prints doubles with .0 if whole number only when needed
    if (Number.isInteger(v) && String(v).includes(".")) return v.toFixed(1);
    return String(v);
  }
  if (v && typeof v === "object" && "__type" in v) return (v as { toString: () => string }).toString();
  return String(v);
}

// ─── Java standard library mocks ─────────────────────────────────────────────

const JavaMath = {
  PI: Math.PI, E: Math.E,
  sqrt: Math.sqrt.bind(Math), abs: Math.abs.bind(Math),
  pow: Math.pow.bind(Math), floor: Math.floor.bind(Math),
  ceil: Math.ceil.bind(Math), round: Math.round.bind(Math),
  max: Math.max.bind(Math), min: Math.min.bind(Math),
  log: Math.log.bind(Math), random: Math.random.bind(Math),
};

// All stdlib mocks are plain objects with a `create` factory method.
// This avoids Object.assign-to-function issues (function.length is read-only).

const __ArrayList = {
  create: (): unknown[] => [],
  add: (list: unknown[], item: unknown) => { list.push(item); },
  remove: (list: unknown[], item: unknown) => {
    const i = typeof item === "number" ? item : list.indexOf(item);
    list.splice(i as number, 1);
  },
};

const __HashMap = {
  create: (): Record<string, unknown> => ({}),
  put: (map: Record<string, unknown>, k: unknown, v: unknown) => { map[String(k)] = v; },
  get: (map: Record<string, unknown>, k: unknown) => map[String(k)] ?? null,
  getOrDefault: (map: Record<string, unknown>, k: unknown, def: unknown) => map[String(k)] ?? def,
  containsKey: (map: Record<string, unknown>, k: unknown) => String(k) in map,
  keySet: (map: Record<string, unknown>) => Object.keys(map),
  values: (map: Record<string, unknown>) => Object.values(map),
};

const __StringBuilder = {
  create: () => ({ __sb: "", __type: "StringBuilder", toString() { return this.__sb; } }),
  append: (sb: { __sb: string }, v: unknown) => { sb.__sb += toStr(v); return sb; },
  reverse: (sb: { __sb: string }) => { sb.__sb = sb.__sb.split("").reverse().join(""); return sb; },
  toString: (sb: { __sb: string }) => sb.__sb,
  sbLength: (sb: { __sb: string }) => sb.__sb.length,
};

const __Arrays = {
  sort: (arr: unknown[]) => arr.sort((a, b) => (a as number) - (b as number)),
  equals: (a: unknown[], b: unknown[]) => JSON.stringify(a) === JSON.stringify(b),
  toString: (arr: unknown[]) => "[" + arr.join(", ") + "]",
};

const __Collections = {
  sort: (list: unknown[]) => list.sort((a, b) => {
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b));
  }),
};

const __Integer = { parseInt: (s: string, radix = 10) => parseInt(s, radix), MAX_VALUE: 2147483647, MIN_VALUE: -2147483648 };
const __Double = { parseDouble: parseFloat };
const __Long = { parseLong: (s: string) => parseInt(s, 10) };
const __Character = { toLowerCase: (c: string) => c.toLowerCase(), toUpperCase: (c: string) => c.toUpperCase(), isLetter: (c: string) => /[a-zA-Z]/.test(c), isDigit: (c: string) => /[0-9]/.test(c) };

const __String = {
  toCharArray: (s: string) => s.split(""),
  indexOf: (s: string, c: string) => typeof s === "string" ? s.indexOf(c) : -1,
  valueOf: (v: unknown) => String(v),
};
