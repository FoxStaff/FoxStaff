export interface TestCase {
  description: string;
  input?: string;
  expectedOutput: string;
}

export interface Challenge {
  slug: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  icon: string;
  points: number;
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: string[];
  tags: string[];
}

export const challenges: Challenge[] = [
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    description:
      "Print numbers 1-20. For multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', multiples of both print 'FizzBuzz'.",
    difficulty: "Easy",
    category: "Logic",
    icon: "🔢",
    points: 50,
    tags: ["loops", "conditions", "classic"],
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Your FizzBuzz solution here
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
    testCases: [
      {
        description: "Numbers 1-20 with Fizz, Buzz, FizzBuzz",
        expectedOutput:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz",
      },
    ],
    hints: [
      "Check for 15 (divisible by both 3 and 5) first",
      "Use the % (modulo) operator: i % 3 == 0",
      "Use a for loop from 1 to 20 inclusive",
    ],
  },
  {
    slug: "palindrome",
    title: "Palindrome Check",
    description:
      "Write a method that returns true if a string is a palindrome (reads the same forward and backward). Test with 'racecar', 'hello', 'madam'.",
    difficulty: "Easy",
    category: "Strings",
    icon: "🔄",
    points: 75,
    tags: ["strings", "logic"],
    starterCode: `public class Main {
    public static boolean isPalindrome(String s) {
        // Your solution here
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar")); // true
        System.out.println(isPalindrome("hello"));   // false
        System.out.println(isPalindrome("madam"));   // true
    }
}`,
    solutionCode: `public class Main {
    public static boolean isPalindrome(String s) {
        String reversed = new StringBuilder(s).reverse().toString();
        return s.equals(reversed);
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
        System.out.println(isPalindrome("madam"));
    }
}`,
    testCases: [
      {
        description: "racecar is palindrome, hello is not, madam is",
        expectedOutput: "true\nfalse\ntrue",
      },
    ],
    hints: [
      "Use StringBuilder's reverse() method",
      "Compare original string with reversed using .equals()",
      "Or compare characters from both ends using a loop",
    ],
  },
  {
    slug: "fibonacci",
    title: "Fibonacci Sequence",
    description:
      "Print the first 10 numbers of the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13, 21, 34).",
    difficulty: "Easy",
    category: "Math",
    icon: "🌀",
    points: 75,
    tags: ["math", "loops", "sequences"],
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Print the first 10 Fibonacci numbers, one per line
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int a = 0, b = 1;
        for (int i = 0; i < 10; i++) {
            System.out.println(a);
            int temp = a + b;
            a = b;
            b = temp;
        }
    }
}`,
    testCases: [
      {
        description: "First 10 Fibonacci numbers",
        expectedOutput: "0\n1\n1\n2\n3\n5\n8\n13\n21\n34",
      },
    ],
    hints: [
      "Start with a=0, b=1",
      "Each step: next = a + b, then a = b, b = next",
      "Use a loop that runs 10 times",
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse a String",
    description:
      "Write a method to reverse a string without using StringBuilder.reverse(). Test with 'Java', 'Hello World', '12345'.",
    difficulty: "Easy",
    category: "Strings",
    icon: "↩️",
    points: 75,
    tags: ["strings", "loops"],
    starterCode: `public class Main {
    public static String reverse(String s) {
        // Reverse the string manually (no StringBuilder.reverse)
        return "";
    }

    public static void main(String[] args) {
        System.out.println(reverse("Java"));        // avaJ
        System.out.println(reverse("Hello World")); // dlroW olleH
        System.out.println(reverse("12345"));       // 54321
    }
}`,
    solutionCode: `public class Main {
    public static String reverse(String s) {
        String result = "";
        for (int i = s.length() - 1; i >= 0; i--) {
            result += s.charAt(i);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(reverse("Java"));
        System.out.println(reverse("Hello World"));
        System.out.println(reverse("12345"));
    }
}`,
    testCases: [
      {
        description: "Reverse 'Java', 'Hello World', '12345'",
        expectedOutput: "avaJ\ndlroW olleH\n54321",
      },
    ],
    hints: [
      "Loop from the last character to the first",
      "Use s.charAt(i) to get a character",
      "Build the result by appending characters",
    ],
  },
  {
    slug: "count-vowels",
    title: "Count Vowels",
    description:
      "Count the number of vowels (a, e, i, o, u) in a given string (case-insensitive). Test with 'Hello World', 'Java Programming', 'rhythm'.",
    difficulty: "Easy",
    category: "Strings",
    icon: "🔤",
    points: 50,
    tags: ["strings", "loops"],
    starterCode: `public class Main {
    public static int countVowels(String s) {
        // Count vowels (case-insensitive)
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(countVowels("Hello World"));     // 3
        System.out.println(countVowels("Java Programming")); // 5
        System.out.println(countVowels("rhythm"));           // 0
    }
}`,
    solutionCode: `public class Main {
    public static int countVowels(String s) {
        int count = 0;
        for (char c : s.toLowerCase().toCharArray()) {
            if ("aeiou".indexOf(c) != -1) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countVowels("Hello World"));
        System.out.println(countVowels("Java Programming"));
        System.out.println(countVowels("rhythm"));
    }
}`,
    testCases: [
      {
        description: "Count vowels in various strings",
        expectedOutput: "3\n5\n0",
      },
    ],
    hints: [
      "Convert to lowercase first with s.toLowerCase()",
      "Use s.toCharArray() to iterate characters",
      'Check if "aeiou".indexOf(c) != -1',
    ],
  },
  {
    slug: "factorial",
    title: "Factorial",
    description:
      "Calculate the factorial of a number using recursion. Print factorial of 0, 5, and 10.",
    difficulty: "Easy",
    category: "Math",
    icon: "🧮",
    points: 75,
    tags: ["math", "recursion"],
    starterCode: `public class Main {
    public static long factorial(int n) {
        // Implement using recursion
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));  // 1
        System.out.println(factorial(5));  // 120
        System.out.println(factorial(10)); // 3628800
    }
}`,
    solutionCode: `public class Main {
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));
        System.out.println(factorial(5));
        System.out.println(factorial(10));
    }
}`,
    testCases: [
      {
        description: "Factorial of 0, 5, and 10",
        expectedOutput: "1\n120\n3628800",
      },
    ],
    hints: [
      "Base case: factorial(0) = 1, factorial(1) = 1",
      "Recursive case: n * factorial(n-1)",
      "Use long instead of int to handle large numbers",
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    description:
      "Implement binary search on a sorted array. Return the index, or -1 if not found. Search for 7 in [1,3,5,7,9,11] and 4 in the same array.",
    difficulty: "Medium",
    category: "Algorithms",
    icon: "🔍",
    points: 150,
    tags: ["algorithms", "search", "arrays"],
    starterCode: `public class Main {
    public static int binarySearch(int[] arr, int target) {
        // Implement binary search
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};
        System.out.println(binarySearch(arr, 7));  // 3
        System.out.println(binarySearch(arr, 4));  // -1
        System.out.println(binarySearch(arr, 1));  // 0
    }
}`,
    solutionCode: `public class Main {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};
        System.out.println(binarySearch(arr, 7));
        System.out.println(binarySearch(arr, 4));
        System.out.println(binarySearch(arr, 1));
    }
}`,
    testCases: [
      {
        description: "Binary search in sorted array",
        expectedOutput: "3\n-1\n0",
      },
    ],
    hints: [
      "Use left and right pointers",
      "mid = left + (right - left) / 2 avoids overflow",
      "If arr[mid] < target, search right half; else search left",
    ],
  },
  {
    slug: "anagram",
    title: "Anagram Checker",
    description:
      "Check if two strings are anagrams (contain the same characters). Test: ('listen','silent'), ('hello','world'), ('triangle','integral').",
    difficulty: "Medium",
    category: "Strings",
    icon: "🔡",
    points: 125,
    tags: ["strings", "sorting", "HashMap"],
    starterCode: `import java.util.Arrays;

public class Main {
    public static boolean isAnagram(String a, String b) {
        // Return true if a and b are anagrams
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));    // true
        System.out.println(isAnagram("hello", "world"));      // false
        System.out.println(isAnagram("triangle", "integral")); // true
    }
}`,
    solutionCode: `import java.util.Arrays;

public class Main {
    public static boolean isAnagram(String a, String b) {
        char[] ca = a.toCharArray();
        char[] cb = b.toCharArray();
        Arrays.sort(ca);
        Arrays.sort(cb);
        return Arrays.equals(ca, cb);
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));
        System.out.println(isAnagram("hello", "world"));
        System.out.println(isAnagram("triangle", "integral"));
    }
}`,
    testCases: [
      {
        description: "Anagram checks",
        expectedOutput: "true\nfalse\ntrue",
      },
    ],
    hints: [
      "Sort both strings' characters and compare",
      "Use s.toCharArray() then Arrays.sort()",
      "Compare with Arrays.equals()",
    ],
  },
  {
    slug: "stack-impl",
    title: "Implement a Stack",
    description:
      "Build a generic Stack class with push, pop, peek, isEmpty, and size methods using an ArrayList.",
    difficulty: "Medium",
    category: "Data Structures",
    icon: "📚",
    points: 175,
    tags: ["data-structures", "OOP", "generics"],
    starterCode: `import java.util.ArrayList;

public class Main {
    static class Stack<T> {
        // Implement push, pop, peek, isEmpty, size

    }

    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        System.out.println(stack.peek());    // 3
        System.out.println(stack.pop());     // 3
        System.out.println(stack.size());    // 2
        System.out.println(stack.isEmpty()); // false
    }
}`,
    solutionCode: `import java.util.ArrayList;

public class Main {
    static class Stack<T> {
        private ArrayList<T> data = new ArrayList<>();

        public void push(T item) { data.add(item); }

        public T pop() {
            if (isEmpty()) throw new RuntimeException("Stack is empty");
            return data.remove(data.size() - 1);
        }

        public T peek() {
            if (isEmpty()) throw new RuntimeException("Stack is empty");
            return data.get(data.size() - 1);
        }

        public boolean isEmpty() { return data.isEmpty(); }
        public int size() { return data.size(); }
    }

    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        System.out.println(stack.peek());
        System.out.println(stack.pop());
        System.out.println(stack.size());
        System.out.println(stack.isEmpty());
    }
}`,
    testCases: [
      {
        description: "Stack operations: peek=3, pop=3, size=2, isEmpty=false",
        expectedOutput: "3\n3\n2\nfalse",
      },
    ],
    hints: [
      "Use an ArrayList<T> as internal storage",
      "push() adds to end, pop() removes from end",
      "peek() returns last element without removing",
    ],
  },
  {
    slug: "word-frequency",
    title: "Word Frequency",
    description:
      "Count the frequency of each word in a sentence and print words with count > 1 in alphabetical order.",
    difficulty: "Hard",
    category: "Algorithms",
    icon: "📈",
    points: 200,
    tags: ["HashMap", "strings", "sorting"],
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        String text = "the cat sat on the mat the cat";
        // Count word frequencies and print words appearing more than once
        // Format: "word: count" in alphabetical order
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        String text = "the cat sat on the mat the cat";
        HashMap<String, Integer> freq = new HashMap<>();
        for (String word : text.split(" ")) {
            freq.put(word, freq.getOrDefault(word, 0) + 1);
        }
        List<String> words = new ArrayList<>(freq.keySet());
        Collections.sort(words);
        for (String word : words) {
            if (freq.get(word) > 1) {
                System.out.println(word + ": " + freq.get(word));
            }
        }
    }
}`,
    testCases: [
      {
        description: "Words appearing more than once, alphabetically sorted",
        expectedOutput: "cat: 2\nthe: 3",
      },
    ],
    hints: [
      "Use HashMap<String, Integer> to count frequencies",
      "freq.getOrDefault(word, 0) + 1 increments safely",
      "Sort the keys with Collections.sort()",
    ],
  },
];

export const getChallengeBySlug = (slug: string) =>
  challenges.find((c) => c.slug === slug);
