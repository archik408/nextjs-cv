'use client';

import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useLanguage } from '@/lib/use-language';
import { ArrowLeft, Home, Github, ExternalLink, Wrench } from 'lucide-react';
import { useEffect } from 'react';

// Import highlight.js
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github-dark.css';

// Register the language
hljs.registerLanguage('javascript', javascript);

// Algorithms data based on your repository structure
const algorithmsData = {
  sorts: {
    title: 'Sorting Algorithms',
    algorithms: [
      {
        name: 'Bubble Sort',
        description: 'Simple comparison-based sorting algorithm',
        code: `// Bubble Sort Implementation
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", array);
console.log("Sorted array:", bubbleSort([...array]));`,
      },
      {
        name: 'Quick Sort',
        description: 'Efficient divide-and-conquer sorting algorithm',
        code: `// Quick Sort Implementation
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Example usage
const array = [10, 7, 8, 9, 1, 5];
console.log("Sorted array:", quickSort([...array]));`,
      },
    ],
  },
  trees: {
    title: 'Tree Algorithms',
    algorithms: [
      {
        name: 'Binary Search Tree',
        description: 'Basic BST implementation with insert, search, and traversal',
        code: `// Binary Search Tree Implementation
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    this.root = this.insertNode(this.root, val);
  }
  
  insertNode(node, val) {
    if (!node) return new TreeNode(val);
    
    if (val < node.val) {
      node.left = this.insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this.insertNode(node.right, val);
    }
    
    return node;
  }
  
  search(val) {
    return this.searchNode(this.root, val);
  }
  
  searchNode(node, val) {
    if (!node || node.val === val) return node;
    
    if (val < node.val) {
      return this.searchNode(node.left, val);
    }
    return this.searchNode(node.right, val);
  }
  
  inorderTraversal() {
    const result = [];
    this.inorder(this.root, result);
    return result;
  }
  
  inorder(node, result) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.val);
      this.inorder(node.right, result);
    }
  }
}

// Example usage
const bst = new BST();
[50, 30, 70, 20, 40, 60, 80].forEach(val => bst.insert(val));
console.log("Inorder traversal:", bst.inorderTraversal());`,
      },
    ],
  },
  graph: {
    title: 'Graph Algorithms',
    algorithms: [
      {
        name: 'Depth-First Search (DFS)',
        description: 'Graph traversal algorithm using depth-first approach',
        code: `// Depth-First Search Implementation
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);
  }
  
  dfs(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;
    
    function dfsHelper(vertex) {
      if (!vertex) return null;
      visited[vertex] = true;
      result.push(vertex);
      
      adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          return dfsHelper(neighbor);
        }
      });
    }
    
    dfsHelper(start);
    return result;
  }
}

// Example usage
const graph = new Graph();
['A', 'B', 'C', 'D', 'E', 'F'].forEach(v => graph.addVertex(v));
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');
graph.addEdge('D', 'E');
graph.addEdge('D', 'F');
graph.addEdge('E', 'F');

console.log("DFS traversal:", graph.dfs('A'));`,
      },
    ],
  },
  linkedlist: {
    title: 'Linked List',
    algorithms: [
      {
        name: 'Singly Linked List',
        description: 'Basic singly linked list implementation',
        code: `// Singly Linked List Implementation
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  append(val) {
    const newNode = new ListNode(val);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  
  prepend(val) {
    const newNode = new ListNode(val);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }
  
  delete(val) {
    if (!this.head) return false;
    
    if (this.head.val === val) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    
    let current = this.head;
    while (current.next && current.next.val !== val) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
      this.size--;
      return true;
    }
    
    return false;
  }
  
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }
}

// Example usage
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.prepend(0);
console.log("List:", list.toArray());
list.delete(2);
console.log("After deleting 2:", list.toArray());`,
      },
    ],
  },
  'euler-project': {
    title: 'Project Euler Solutions',
    algorithms: [
      {
        name: 'Problem 1: Multiples of 3 and 5',
        description: 'Find the sum of all multiples of 3 or 5 below 1000',
        code: `// Project Euler Problem 1
// Find the sum of all the multiples of 3 or 5 below 1000

function multiplesOf3And5(limit) {
  let sum = 0;
  
  for (let i = 1; i < limit; i++) {
    if (i % 3 === 0 || i % 5 === 0) {
      sum += i;
    }
  }
  
  return sum;
}

// More efficient solution using arithmetic progression
function multiplesOf3And5Optimized(limit) {
  const sumDivisibleBy = (n) => {
    const p = Math.floor((limit - 1) / n);
    return n * (p * (p + 1)) / 2;
  };
  
  return sumDivisibleBy(3) + sumDivisibleBy(5) - sumDivisibleBy(15);
}

console.log("Brute force result:", multiplesOf3And5(1000));
console.log("Optimized result:", multiplesOf3And5Optimized(1000));`,
      },
      {
        name: 'Problem 2: Even Fibonacci Numbers',
        description: 'Find the sum of even-valued Fibonacci terms below 4 million',
        code: `// Project Euler Problem 2
// Find the sum of the even-valued terms in the Fibonacci sequence
// whose values do not exceed four million

function evenFibonacci(limit) {
  let sum = 0;
  let a = 1, b = 2;
  
  while (b < limit) {
    if (b % 2 === 0) {
      sum += b;
    }
    
    [a, b] = [b, a + b];
  }
  
  return sum;
}

// Alternative approach generating only even Fibonacci numbers
function evenFibonacciOptimized(limit) {
  let sum = 0;
  let a = 2, b = 8; // First two even Fibonacci numbers
  
  sum += a; // Add the first even number (2)
  
  while (b < limit) {
    sum += b;
    [a, b] = [b, 4 * b + a]; // Formula for next even Fibonacci
  }
  
  return sum;
}

console.log("Even Fibonacci sum:", evenFibonacci(4000000));
console.log("Optimized result:", evenFibonacciOptimized(4000000));`,
      },
    ],
  },
};

export function AlgorithmsPageClient() {
  const { t } = useLanguage();

  useEffect(() => {
    // Highlight all code blocks after component mounts
    hljs.highlightAll();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Theme and Language Switchers */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeSwitcher />
      </div>

      {/* Back Navigation */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg transition-colors"
          title={t.toolsAndExperiments || 'Tools & Experiments'}
        >
          <ArrowLeft className="w-4 h-4" />
          <Wrench className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg transition-colors"
          title={t.home || 'Home'}
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {t.algorithmsTitle || 'Algorithms & Data Structures'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {t.algorithmsDescription ||
                'Collection of algorithm implementations and data structure solutions from competitive programming practice.'}
            </p>

            {/* GitHub Repository Link */}
            <Link
              href="https://github.com/archik408/alg-and-ds-practise"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
            >
              <Github className="w-5 h-5" />
              {t.viewOnGitHub || 'View on GitHub'}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Algorithm Categories */}
          <div className="space-y-12">
            {Object.entries(algorithmsData).map(([categoryKey, category]) => (
              <div key={categoryKey} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                  {category.title}
                </h2>

                <div className="space-y-8">
                  {category.algorithms.map((algorithm, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      {/* Algorithm Header */}
                      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {algorithm.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{algorithm.description}</p>
                      </div>

                      {/* Code Block */}
                      <div className="relative">
                        <pre className="overflow-x-auto">
                          <code className="language-javascript text-sm">{algorithm.code}</code>
                        </pre>

                        {/* Copy Button */}
                        <button
                          onClick={() => navigator.clipboard.writeText(algorithm.code)}
                          className="absolute top-4 right-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                          title="Copy code"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
                {t.algorithmsRepository || 'Algorithms Repository'}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                These implementations are part of my competitive programming practice and algorithm
                study. Check out the full repository for more solutions and detailed explanations.
              </p>
              <Link
                href="https://github.com/archik408/alg-and-ds-practise"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                {t.viewOnGitHub || 'View on GitHub'}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
