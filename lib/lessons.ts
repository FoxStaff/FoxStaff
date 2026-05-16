export interface Lesson {
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  icon: string;
  tags: string[];
  theory: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hints: string[];
  mustContain?: string[][];
}

export const lessons: Lesson[] = [
  {
    slug: "hello-world",
    title: "Hello, World!",
    description: "Write your first Java program and understand the basic structure.",
    difficulty: "Beginner",
    duration: "5 min",
    icon: "👋",
    tags: ["basics", "output"],
    theory: `## Your First Java Program

Every Java program starts with a **class** and a **main method**. The \`main\` method is the entry point — where execution begins.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Key concepts:
- **\`public class Main\`** — defines a class named \`Main\`
- **\`public static void main\`** — the method Java runs first
- **\`System.out.println()\`** — prints text to the console with a newline
- Every statement ends with a **semicolon** \`;\`
`,
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Print "Hello, World!" to the console

    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    expectedOutput: "Hello, World!",
    hints: [
      "Use System.out.println() to print text",
      'Put your text in double quotes: "Hello, World!"',
    ],
    mustContain: [["system.out.println"]],
  },
  {
    slug: "variables",
    title: "Variables & Data Types",
    description: "Learn how to store and work with different types of data in Java.",
    difficulty: "Beginner",
    duration: "10 min",
    icon: "📦",
    tags: ["variables", "types", "basics"],
    theory: `## Variables & Data Types

Java is **statically typed** — you must declare the type of every variable.

### Primitive Types
| Type | Size | Example |
|------|------|---------|
| \`int\` | 32-bit | \`int age = 25;\` |
| \`double\` | 64-bit | \`double pi = 3.14;\` |
| \`boolean\` | 1-bit | \`boolean isJavaFun = true;\` |
| \`char\` | 16-bit | \`char grade = 'A';\` |

### String (Reference Type)
\`\`\`java
String name = "Alice";
System.out.println("Hello, " + name);
\`\`\`

### String Concatenation
Use \`+\` to join strings and values:
\`\`\`java
int age = 30;
System.out.println("Age: " + age);
\`\`\`
`,
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Create variables: name (String), age (int), gpa (double)
        // Print: "Name: Alice, Age: 20, GPA: 3.8"

    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        String name = "Alice";
        int age = 20;
        double gpa = 3.8;
        System.out.println("Name: " + name + ", Age: " + age + ", GPA: " + gpa);
    }
}`,
    expectedOutput: "Name: Alice, Age: 20, GPA: 3.8",
    hints: [
      "Declare String with: String name = \"Alice\";",
      "Declare int with: int age = 20;",
      'Use + to concatenate: "Name: " + name',
    ],
    mustContain: [["string ", "int ", "double ", "float ", "char ", "long "], ["+"]],
  },
  {
    slug: "control-flow",
    title: "Control Flow",
    description: "Master if/else statements to make decisions in your code.",
    difficulty: "Beginner",
    duration: "10 min",
    icon: "🔀",
    tags: ["if-else", "conditions", "logic"],
    theory: `## Control Flow: if / else

Use \`if\` statements to run code conditionally.

\`\`\`java
int score = 85;

if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");
} else if (score >= 70) {
    System.out.println("Grade: C");
} else {
    System.out.println("Grade: F");
}
\`\`\`

### Comparison Operators
| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater or equal |
| \`<=\` | Less or equal |

### Logical Operators
- \`&&\` — AND
- \`||\` — OR
- \`!\` — NOT
`,
    starterCode: `public class Main {
    public static void main(String[] args) {
        int temperature = 28;
        // If temp > 30: print "It's hot!"
        // If temp > 20: print "It's warm!"
        // Otherwise: print "It's cold!"

    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int temperature = 28;
        if (temperature > 30) {
            System.out.println("It's hot!");
        } else if (temperature > 20) {
            System.out.println("It's warm!");
        } else {
            System.out.println("It's cold!");
        }
    }
}`,
    expectedOutput: "It's warm!",
    hints: [
      "Use if (temperature > 30) for the first condition",
      "Chain conditions with else if",
      "The final else catches everything else",
    ],
    mustContain: [["if"], ["else"]],
  },
  {
    slug: "loops",
    title: "Loops",
    description: "Repeat code efficiently using for, while, and do-while loops.",
    difficulty: "Beginner",
    duration: "15 min",
    icon: "🔁",
    tags: ["loops", "for", "while", "iteration"],
    theory: `## Loops in Java

### for Loop
Best when you know how many times to repeat:
\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println("Count: " + i);
}
\`\`\`

### while Loop
Repeats while a condition is true:
\`\`\`java
int n = 1;
while (n <= 5) {
    System.out.println(n);
    n++;
}
\`\`\`

### Enhanced for (for-each)
Iterate over arrays or collections:
\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}
\`\`\`

### Break & Continue
- \`break\` — exit the loop immediately
- \`continue\` — skip to next iteration
`,
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Print the multiplication table for 3 (3x1 to 3x10)
        // Format: "3 x 1 = 3"

    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println("3 x " + i + " = " + (3 * i));
        }
    }
}`,
    expectedOutput: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30",
    hints: [
      "Use a for loop: for (int i = 1; i <= 10; i++)",
      'Print with: System.out.println("3 x " + i + " = " + (3 * i))',
      "Wrap the multiplication in parentheses: (3 * i)",
    ],
    mustContain: [["for", "while"]],
  },
  {
    slug: "arrays",
    title: "Arrays",
    description: "Store and manipulate collections of data with arrays.",
    difficulty: "Beginner",
    duration: "15 min",
    icon: "📊",
    tags: ["arrays", "data-structures"],
    theory: `## Arrays in Java

An array stores multiple values of the **same type**.

### Declaring & Creating
\`\`\`java
int[] scores = {90, 85, 78, 92, 88};
String[] names = new String[3];
names[0] = "Alice";
names[1] = "Bob";
names[2] = "Charlie";
\`\`\`

### Accessing Elements
Arrays are **zero-indexed** — first element is at index 0.
\`\`\`java
System.out.println(scores[0]); // 90
System.out.println(scores.length); // 5
\`\`\`

### Iterating
\`\`\`java
for (int score : scores) {
    System.out.println(score);
}
\`\`\`

### Useful: Arrays class
\`\`\`java
import java.util.Arrays;
Arrays.sort(scores);
System.out.println(Arrays.toString(scores));
\`\`\`
`,
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {5, 2, 8, 1, 9, 3};
        // Find and print the largest number in the array

    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {5, 2, 8, 1, 9, 3};
        int max = numbers[0];
        for (int num : numbers) {
            if (num > max) {
                max = num;
            }
        }
        System.out.println("Largest: " + max);
    }
}`,
    expectedOutput: "Largest: 9",
    hints: [
      "Start with max = numbers[0]",
      "Loop through each number",
      "Update max if num > max",
    ],
    mustContain: [["for", "while"], ["if", ">", "<"]],
  },
  {
    slug: "methods",
    title: "Methods",
    description: "Organize and reuse code by writing your own methods.",
    difficulty: "Intermediate",
    duration: "20 min",
    icon: "⚙️",
    tags: ["methods", "functions", "parameters"],
    theory: `## Methods in Java

Methods let you group code into reusable blocks.

### Syntax
\`\`\`java
public static returnType methodName(parameters) {
    // body
    return value;
}
\`\`\`

### Example
\`\`\`java
public static int add(int a, int b) {
    return a + b;
}

public static void greet(String name) {
    System.out.println("Hello, " + name + "!");
}
\`\`\`

### Calling Methods
\`\`\`java
int sum = add(5, 3);      // sum = 8
greet("Alice");            // prints: Hello, Alice!
\`\`\`

### void vs return type
- \`void\` — method returns nothing
- Specify the type (\`int\`, \`String\`, etc.) if it returns a value

### Method Overloading
Multiple methods can share a name if their parameters differ:
\`\`\`java
public static int multiply(int a, int b) { return a * b; }
public static double multiply(double a, double b) { return a * b; }
\`\`\`
`,
    starterCode: `public class Main {
    // Write a method called "isPrime" that returns true if a number is prime

    public static void main(String[] args) {
        System.out.println(isPrime(7));   // true
        System.out.println(isPrime(10));  // false
        System.out.println(isPrime(13));  // true
    }
}`,
    solutionCode: `public class Main {
    public static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(7));
        System.out.println(isPrime(10));
        System.out.println(isPrime(13));
    }
}`,
    expectedOutput: "true\nfalse\ntrue",
    hints: [
      "A prime number is only divisible by 1 and itself",
      "Loop from 2 to sqrt(n) and check if n % i == 0",
      "Use Math.sqrt(n) for efficiency",
    ],
    mustContain: [["isprime", "boolean"], ["for", "while", "%"]],
  },
  {
    slug: "oop-basics",
    title: "Classes & Objects",
    description: "Discover Object-Oriented Programming — the core of Java.",
    difficulty: "Intermediate",
    duration: "25 min",
    icon: "🏗️",
    tags: ["OOP", "classes", "objects"],
    theory: `## Object-Oriented Programming

### Defining a Class
\`\`\`java
public class Dog {
    // Fields (attributes)
    String name;
    int age;

    // Constructor
    public Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Method
    public void bark() {
        System.out.println(name + " says: Woof!");
    }

    public String toString() {
        return name + " (age " + age + ")";
    }
}
\`\`\`

### Creating Objects
\`\`\`java
Dog rex = new Dog("Rex", 3);
rex.bark();                     // Rex says: Woof!
System.out.println(rex);        // Rex (age 3)
\`\`\`

### \`this\` keyword
Refers to the current object — used to distinguish field from parameter with the same name.

### Encapsulation (private + getters/setters)
\`\`\`java
private int age;
public int getAge() { return age; }
public void setAge(int age) { this.age = age; }
\`\`\`
`,
    starterCode: `public class Main {
    // Create a "Rectangle" class with width and height fields,
    // a constructor, an area() method, and a perimeter() method

    public static void main(String[] args) {
        // Create a rectangle 5x3 and print its area and perimeter
    }
}`,
    solutionCode: `public class Main {
    static class Rectangle {
        double width;
        double height;

        public Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }

        public double area() {
            return width * height;
        }

        public double perimeter() {
            return 2 * (width + height);
        }
    }

    public static void main(String[] args) {
        Rectangle r = new Rectangle(5, 3);
        System.out.println("Area: " + r.area());
        System.out.println("Perimeter: " + r.perimeter());
    }
}`,
    expectedOutput: "Area: 15.0\nPerimeter: 16.0",
    hints: [
      "Define Rectangle as a static inner class inside Main",
      "Constructor: public Rectangle(double width, double height)",
      "area() returns width * height",
    ],
    mustContain: [["class"], ["area"], ["*"]],
  },
  {
    slug: "inheritance",
    title: "Inheritance",
    description: "Extend classes to reuse and specialize behavior.",
    difficulty: "Intermediate",
    duration: "20 min",
    icon: "🧬",
    tags: ["OOP", "inheritance", "extends"],
    theory: `## Inheritance

Inheritance lets a class **extend** another, inheriting its fields and methods.

\`\`\`java
public class Animal {
    String name;

    public Animal(String name) {
        this.name = name;
    }

    public void speak() {
        System.out.println(name + " makes a sound.");
    }
}

public class Cat extends Animal {
    public Cat(String name) {
        super(name); // calls Animal constructor
    }

    @Override
    public void speak() {
        System.out.println(name + " says: Meow!");
    }
}
\`\`\`

### Key Concepts
- **\`extends\`** — inherit from a parent class
- **\`super()\`** — call the parent constructor
- **\`@Override\`** — override a parent method
- **Polymorphism** — a Cat IS-A Animal

\`\`\`java
Animal a = new Cat("Whiskers");
a.speak(); // Whiskers says: Meow!
\`\`\`
`,
    starterCode: `public class Main {
    static class Shape {
        String color;
        public Shape(String color) { this.color = color; }
        public double area() { return 0; }
        public void describe() {
            System.out.println(color + " shape, area: " + area());
        }
    }

    // Create Circle (extends Shape) with radius field and area = PI * r^2
    // Create Square (extends Shape) with side field and area = side^2

    public static void main(String[] args) {
        // Create a red circle radius 5 and blue square side 4, call describe() on each
    }
}`,
    solutionCode: `public class Main {
    static class Shape {
        String color;
        public Shape(String color) { this.color = color; }
        public double area() { return 0; }
        public void describe() {
            System.out.println(color + " shape, area: " + area());
        }
    }

    static class Circle extends Shape {
        double radius;
        public Circle(String color, double radius) {
            super(color);
            this.radius = radius;
        }
        @Override
        public double area() {
            return Math.PI * radius * radius;
        }
    }

    static class Square extends Shape {
        double side;
        public Square(String color, double side) {
            super(color);
            this.side = side;
        }
        @Override
        public double area() {
            return side * side;
        }
    }

    public static void main(String[] args) {
        Circle c = new Circle("Red", 5);
        Square s = new Square("Blue", 4);
        c.describe();
        s.describe();
    }
}`,
    expectedOutput: "Red shape, area: 78.53981633974483\nBlue shape, area: 16.0",
    hints: [
      "Use extends Shape in the class declaration",
      "Call super(color) in the constructor",
      "@Override the area() method",
    ],
    mustContain: [["extends"], ["super"]],
  },
  {
    slug: "collections",
    title: "Collections",
    description: "Work with ArrayList and HashMap — Java's most used data structures.",
    difficulty: "Intermediate",
    duration: "20 min",
    icon: "🗃️",
    tags: ["collections", "ArrayList", "HashMap"],
    theory: `## Java Collections

### ArrayList — dynamic array
\`\`\`java
import java.util.ArrayList;

ArrayList<String> fruits = new ArrayList<>();
fruits.add("Apple");
fruits.add("Banana");
fruits.add("Cherry");

System.out.println(fruits.size());   // 3
System.out.println(fruits.get(0));   // Apple
fruits.remove("Banana");

for (String fruit : fruits) {
    System.out.println(fruit);
}
\`\`\`

### HashMap — key-value store
\`\`\`java
import java.util.HashMap;

HashMap<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);

System.out.println(scores.get("Alice")); // 95
System.out.println(scores.containsKey("Bob")); // true

for (String name : scores.keySet()) {
    System.out.println(name + ": " + scores.get(name));
}
\`\`\`
`,
    starterCode: `import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(42);
        numbers.add(17);
        numbers.add(8);
        numbers.add(99);
        numbers.add(3);

        // Sort the list and print min, max, and all numbers
    }
}`,
    solutionCode: `import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(42);
        numbers.add(17);
        numbers.add(8);
        numbers.add(99);
        numbers.add(3);

        Collections.sort(numbers);
        System.out.println("Min: " + numbers.get(0));
        System.out.println("Max: " + numbers.get(numbers.size() - 1));
        System.out.println("Sorted: " + numbers);
    }
}`,
    expectedOutput: "Min: 3\nMax: 99\nSorted: [3, 8, 17, 42, 99]",
    hints: [
      "Use Collections.sort(numbers) to sort",
      "After sorting, first element is min, last is max",
      "numbers.get(numbers.size() - 1) gives the last element",
    ],
    mustContain: [["sort"], ["get", "size"]],
  },
  {
    slug: "exceptions",
    title: "Exception Handling",
    description: "Handle errors gracefully with try-catch-finally.",
    difficulty: "Advanced",
    duration: "20 min",
    icon: "🛡️",
    tags: ["exceptions", "try-catch", "error-handling"],
    theory: `## Exception Handling

Exceptions are errors that occur at runtime. Handle them with \`try-catch\`.

\`\`\`java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
} finally {
    System.out.println("This always runs");
}
\`\`\`

### Multiple Catch Blocks
\`\`\`java
try {
    String s = null;
    s.length();
} catch (NullPointerException e) {
    System.out.println("Null pointer!");
} catch (Exception e) {
    System.out.println("General error: " + e.getMessage());
}
\`\`\`

### Custom Exceptions
\`\`\`java
class AgeException extends Exception {
    public AgeException(String msg) { super(msg); }
}

public static void setAge(int age) throws AgeException {
    if (age < 0) throw new AgeException("Age cannot be negative");
}
\`\`\`

### Common Exceptions
- \`NullPointerException\` — null reference
- \`ArrayIndexOutOfBoundsException\` — bad array index
- \`NumberFormatException\` — invalid number parse
- \`ArithmeticException\` — e.g., divide by zero
`,
    starterCode: `public class Main {
    public static int divide(int a, int b) {
        // Throw IllegalArgumentException if b is 0
        // Otherwise return a / b
        return 0;
    }

    public static void main(String[] args) {
        // Try dividing 10 by 2 (should print result)
        // Try dividing 5 by 0 (should catch and print the error)
    }
}`,
    solutionCode: `public class Main {
    public static int divide(int a, int b) {
        if (b == 0) throw new IllegalArgumentException("Cannot divide by zero");
        return a / b;
    }

    public static void main(String[] args) {
        try {
            System.out.println("Result: " + divide(10, 2));
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }

        try {
            System.out.println("Result: " + divide(5, 0));
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
    expectedOutput: "Result: 5\nError: Cannot divide by zero",
    hints: [
      "throw new IllegalArgumentException(\"message\") to throw",
      "Wrap the method call in try-catch",
      "catch (IllegalArgumentException e) catches the specific error",
    ],
    mustContain: [["try"], ["catch"], ["throw"]],
  },
];

export const getLessonBySlug = (slug: string) =>
  lessons.find((l) => l.slug === slug);
