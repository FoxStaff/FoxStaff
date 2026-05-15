"use client";

import { useState } from "react";
import JavaEditor from "@/components/JavaEditor";
import { Terminal, Sparkles } from "lucide-react";

const SNIPPETS = [
  {
    label: "Hello World",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    label: "For Loop",
    code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Line " + i);
        }
    }
}`,
  },
  {
    label: "ArrayList",
    code: `import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(3); nums.add(1); nums.add(4); nums.add(1); nums.add(5);
        Collections.sort(nums);
        System.out.println(nums);
    }
}`,
  },
  {
    label: "Recursion",
    code: `public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 8; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();
    }
}`,
  },
  {
    label: "OOP",
    code: `public class Main {
    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        void speak() { System.out.println(name + " makes a sound"); }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }
        @Override
        void speak() { System.out.println(name + " says: Woof!"); }
    }

    public static void main(String[] args) {
        Animal a = new Animal("Generic");
        Animal d = new Dog("Rex");
        a.speak();
        d.speak();
    }
}`,
  },
];

export default function PlaygroundPage() {
  const [selectedSnippet, setSelectedSnippet] = useState(0);
  const [key, setKey] = useState(0);

  const handleSnippet = (i: number) => {
    setSelectedSnippet(i);
    setKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-400">
          <Terminal className="h-4 w-4" />
          Free Java Sandbox
        </div>
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">Playground</h1>
        <p className="text-gray-400">
          Experiment freely with Java. Write, run, and iterate — no setup needed.
        </p>
      </div>

      {/* Snippet picker */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4" />
          Quick start snippets
        </div>
        <div className="flex flex-wrap gap-2">
          {SNIPPETS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSnippet(i)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                selectedSnippet === i
                  ? "border-orange-500/50 bg-orange-500/15 text-orange-400"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div key={key}>
        <JavaEditor initialCode={SNIPPETS[selectedSnippet].code} />
      </div>

      {/* Tips */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">Java Quick Reference</h3>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          {[
            { label: "Print", code: 'System.out.println("text");' },
            { label: "Variable", code: "int x = 42;" },
            { label: "For loop", code: "for (int i = 0; i < 10; i++)" },
            { label: "String", code: 'String s = "hello";' },
            { label: "Array", code: "int[] arr = {1, 2, 3};" },
            { label: "If/else", code: "if (x > 0) { } else { }" },
          ].map(({ label, code }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-gray-500">{label}</span>
              <code className="rounded-lg bg-gray-900 px-2 py-1 font-mono text-xs text-orange-300 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{code}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
