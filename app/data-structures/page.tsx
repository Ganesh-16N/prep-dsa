'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Layers, Database, Code, Target, Clock, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Box, Link as LinkIcon, Trees, Network, Slack, Hash, FileText, TrendingUp } from 'lucide-react';

interface DataStructure {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  operations: {
    access: string;
    search: string;
    insert: string;
    delete: string;
  };
  spaceComplexity: string;
  useCases: string[];
  codeExample: string;
  visualization: string;
}

export default function DataStructuresPage() {
  const [selectedStructure, setSelectedStructure] = useState('array');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dataStructures: DataStructure[] = [
    {
      id: 'array',
      name: 'Array',
      description: 'Contiguous memory locations storing elements with index-based access',
      category: 'Linear',
      icon: Box,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
      operations: {
        access: 'O(1)',
        search: 'O(n)',
        insert: 'O(n)',
        delete: 'O(n)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['Dynamic lists', 'Sequential data', 'Matrix operations', 'Buffer storage'],
      codeExample: `let arr = [10, 20, 30];
arr.push(40);    // O(1) - add to end
arr.unshift(5);  // O(n) - add to front
arr.pop();       // O(1) - remove from end
arr.shift();     // O(n) - remove from front
arr[2];          // O(1) - access by index`,
      visualization: '📦📦📦📦 (indexed boxes)'
    },
    {
      id: 'string',
      name: 'String',
      description: 'Sequence of characters with immutable properties',
      category: 'Linear',
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
      operations: {
        access: 'O(1)',
        search: 'O(n)',
        insert: 'O(n)',
        delete: 'O(n)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['Text processing', 'Pattern matching', 'Parsing', 'Data validation'],
      codeExample: `let str = "Hello World";
str.charAt(0);           // O(1) - access
str.indexOf("World");    // O(n) - search
str.concat("!");         // O(n) - concatenation
str.substring(0, 5);     // O(n) - substring`,
      visualization: 'H-e-l-l-o (character sequence)'
    },
    {
      id: 'object',
      name: 'Object/HashMap',
      description: 'Key-value pairs with hash-based access',
      category: 'Non-Linear',
      icon: Hash,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700',
      operations: {
        access: 'O(1)',
        search: 'O(1)',
        insert: 'O(1)',
        delete: 'O(1)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['Fast lookups', 'Caching', 'Counting frequencies', 'Graph adjacency lists'],
      codeExample: `let obj = { name: "John", age: 30 };
obj.name;              // O(1) - access
obj.city = "NYC";      // O(1) - insert
delete obj.age;        // O(1) - delete
obj.hasOwnProperty("name"); // O(1) - search`,
      visualization: '🔑→📦 (key-value pairs)'
    },
    {
      id: 'stack',
      name: 'Stack',
      description: 'Last-In-First-Out (LIFO) data structure',
      category: 'Linear',
      icon: Slack,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700',
      operations: {
        access: 'O(n)',
        search: 'O(n)',
        insert: 'O(1)',
        delete: 'O(1)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['Function call stack', 'Undo operations', 'Expression evaluation', 'Backtracking'],
      codeExample: `let stack = [];
stack.push(10);    // O(1) - push
stack.push(20);
stack.push(30);
stack.pop();        // O(1) - pop (removes 30)
stack.peek();       // O(1) - peek (shows 20)`,
      visualization: '📦 (top) → 📦 → 📦 (bottom)'
    },
    {
      id: 'queue',
      name: 'Queue',
      description: 'First-In-First-Out (FIFO) data structure',
      category: 'Linear',
      icon: Network,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      operations: {
        access: 'O(n)',
        search: 'O(n)',
        insert: 'O(1)',
        delete: 'O(1)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['Breadth-First Search', 'Task scheduling', 'Print spooling', 'Event handling'],
      codeExample: `let queue = [];
queue.push(10);     // O(1) - enqueue
queue.push(20);
queue.push(30);
queue.shift();      // O(1) - dequeue (removes 10)
queue[0];           // O(1) - peek (shows 20)`,
      visualization: '📦 (front) → 📦 → 📦 (back)'
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      description: 'Nodes connected by pointers, allowing dynamic memory allocation',
      category: 'Linear',
      icon: LinkIcon,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-700',
      operations: {
        access: 'O(n)',
        search: 'O(n)',
        insert: 'O(1)',
        delete: 'O(1)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['Memory-efficient lists', 'LRU cache implementation', 'Polynomial arithmetic', 'Music playlist'],
      codeExample: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

let head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

// Insert at head: O(1)
// Insert at tail: O(n)
// Delete: O(1) if position known`,
      visualization: '📦→📦→📦→null (connected nodes)'
    },
    {
      id: 'tree',
      name: 'Tree',
      description: 'Hierarchical structure with parent-child relationships',
      category: 'Non-Linear',
      icon: Trees,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-700',
      operations: {
        access: 'O(log n)',
        search: 'O(log n)',
        insert: 'O(log n)',
        delete: 'O(log n)'
      },
      spaceComplexity: 'O(n)',
      useCases: ['File systems', 'Database indexing', 'Expression trees', 'Decision trees'],
      codeExample: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Binary Search Tree operations:
// Search: O(log n) - balanced
// Insert: O(log n) - balanced
// Delete: O(log n) - balanced
// Traversal: O(n) - inorder, preorder, postorder`,
      visualization: '    📦    \n   /  \\   \n  📦  📦  \n / \\ / \\ \n📦📦📦📦'
    },
    {
      id: 'graph',
      name: 'Graph',
      description: 'Collection of vertices connected by edges',
      category: 'Non-Linear',
      icon: Network,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20',
      borderColor: 'border-pink-700',
      operations: {
        access: 'O(1)',
        search: 'O(V+E)',
        insert: 'O(1)',
        delete: 'O(1)'
      },
      spaceComplexity: 'O(V+E)',
      useCases: ['Social networks', 'Navigation systems', 'Dependency resolution', 'Network routing'],
      codeExample: `// Adjacency List representation
const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C"]
};

// Adjacency Matrix: O(V²) space
// Adjacency List: O(V+E) space
// BFS/DFS: O(V+E) time`,
      visualization: '📦←→📦\n ↕  ↕\n📦←→📦 (connected nodes)'
    }
  ];

  const selectedStructureData = dataStructures.find(ds => ds.id === selectedStructure);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 8) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 8));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                🧰 Data Structures Overview
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                JavaScript Interview Preparation (20 LPA Level)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Core Explanation */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">🎯 Core Concepts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  What are Data Structures?
                </h3>
                <p className="text-gray-300 mb-4">
                  Data structures are specialized formats for organizing, processing, retrieving, and storing data. 
                  They are the building blocks of efficient algorithms and form the foundation of software development.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Analogy:</strong> Think of them as different types of containers in a toolbox - each optimized for specific tasks.
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Why They Matter in Interviews
                </h3>
                <p className="text-gray-300 mb-4">
                  Interviewers test your ability to choose the right data structure for the problem. 
                  The wrong choice can lead to inefficient solutions, while the right choice can make complex problems simple.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key:</strong> Understanding trade-offs between time, space, and implementation complexity.
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-yellow-400 mb-4">📊 Data Structure Categories</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-400">Primitive vs Non-Primitive</h4>
                  <p className="text-sm text-gray-300">Primitive: numbers, strings, booleans | Non-Primitive: arrays, objects, functions</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-400">Linear vs Non-Linear</h4>
                  <p className="text-sm text-gray-300">Linear: arrays, linked lists | Non-Linear: trees, graphs</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-purple-400">Static vs Dynamic</h4>
                  <p className="text-sm text-gray-300">Static: fixed size | Dynamic: grows/shrinks as needed</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-400">Memory Allocation</h4>
                  <p className="text-sm text-gray-300">Contiguous: arrays | Non-contiguous: linked lists, trees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Structure Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🔍 Explore Data Structures</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dataStructures.map((structure) => {
              const IconComponent = structure.icon;
              return (
                <button
                  key={structure.id}
                  onClick={() => setSelectedStructure(structure.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    selectedStructure === structure.id
                      ? `${structure.bgColor} ${structure.borderColor} shadow-lg`
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`w-6 h-6 ${structure.color}`} />
                    <div className={`text-lg font-bold ${structure.color}`}>
                      {structure.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300">
                    {structure.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Structure Details */}
          <div className="space-y-6">
            {/* Selected Structure Details */}
            {selectedStructureData && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <selectedStructureData.icon className={`w-8 h-8 ${selectedStructureData.color}`} />
                    <h2 className={`text-3xl font-bold ${selectedStructureData.color}`}>
                      {selectedStructureData.name}
                    </h2>
                  </div>
                  <p className="text-gray-300 text-lg mb-3">
                    {selectedStructureData.description}
                  </p>
                  <div className="inline-block bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                    {selectedStructureData.category} Structure
                  </div>
                </div>

                <div className={`${selectedStructureData.bgColor} border ${selectedStructureData.borderColor} rounded-lg p-4 mb-4`}>
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Common Use Cases
                  </h4>
                  <ul className="space-y-2">
                    {selectedStructureData.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Visualization
                  </h4>
                  <div className="text-center text-2xl font-mono bg-gray-800 rounded p-4">
                    {selectedStructureData.visualization}
                  </div>
                </div>
              </div>
            )}

            {/* Code Example */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">💻 Code Example</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{selectedStructureData?.codeExample}</pre>
              </div>
            </div>
          </div>

          {/* Right Column - Complexity Analysis */}
          <div className="space-y-6">
            {/* Complexity Table */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📊 Time & Space Complexity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2 text-gray-300">Operation</th>
                      <th className="text-left p-2 text-gray-300">Time Complexity</th>
                      <th className="text-left p-2 text-gray-300">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-white">Access</td>
                      <td className={`p-2 font-bold ${selectedStructureData?.operations.access === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedStructureData?.operations.access}
                      </td>
                      <td className="p-2 text-gray-300">Get element at position</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-white">Search</td>
                      <td className={`p-2 font-bold ${selectedStructureData?.operations.search === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedStructureData?.operations.search}
                      </td>
                      <td className="p-2 text-gray-300">Find element by value</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-white">Insert</td>
                      <td className={`p-2 font-bold ${selectedStructureData?.operations.insert === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedStructureData?.operations.insert}
                      </td>
                      <td className="p-2 text-gray-300">Add new element</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-white">Delete</td>
                      <td className={`p-2 font-bold ${selectedStructureData?.operations.delete === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedStructureData?.operations.delete}
                      </td>
                      <td className="p-2 text-gray-300">Remove element</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="text-sm text-gray-400">Space Complexity</div>
                <div className="text-lg font-bold text-blue-400">{selectedStructureData?.spaceComplexity}</div>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">🎮 Operation Animation</h3>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === 8}
                  className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors"
                >
                  <SkipForward size={20} />
                </button>
                <button
                  onClick={reset}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {currentStep === 0 && '📦📦📦📦'}
                    {currentStep === 1 && '📦📦📦📦📦'}
                    {currentStep === 2 && '📦📦📦📦'}
                    {currentStep === 3 && '📦📦📦'}
                    {currentStep === 4 && '📦📦📦📦'}
                    {currentStep === 5 && '📦📦📦📦📦'}
                    {currentStep === 6 && '📦📦📦📦'}
                    {currentStep === 7 && '📦📦📦'}
                    {currentStep === 8 && '📦📦📦📦'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Step {currentStep}: {currentStep === 0 && 'Initial State'}
                    {currentStep === 1 && 'Insert Operation'}
                    {currentStep === 2 && 'Access Operation'}
                    {currentStep === 3 && 'Delete Operation'}
                    {currentStep === 4 && 'Search Operation'}
                    {currentStep === 5 && 'Insert Again'}
                    {currentStep === 6 && 'Access Again'}
                    {currentStep === 7 && 'Delete Again'}
                    {currentStep === 8 && 'Final State'}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 8) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">📊 Data Structure Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Data Structure</th>
                  <th className="text-left p-3 text-gray-300">Access</th>
                  <th className="text-left p-3 text-gray-300">Search</th>
                  <th className="text-left p-3 text-gray-300">Insert</th>
                  <th className="text-left p-3 text-gray-300">Delete</th>
                  <th className="text-left p-3 text-gray-300">Space</th>
                  <th className="text-left p-3 text-gray-300">Best Use Case</th>
                </tr>
              </thead>
              <tbody>
                {dataStructures.map((ds) => (
                  <tr key={ds.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-3 text-white font-medium">{ds.name}</td>
                    <td className={`p-3 font-bold ${ds.operations.access === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {ds.operations.access}
                    </td>
                    <td className={`p-3 font-bold ${ds.operations.search === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {ds.operations.search}
                    </td>
                    <td className={`p-3 font-bold ${ds.operations.insert === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {ds.operations.insert}
                    </td>
                    <td className={`p-3 font-bold ${ds.operations.delete === 'O(1)' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {ds.operations.delete}
                    </td>
                    <td className="p-3 text-blue-400 font-bold">{ds.spaceComplexity}</td>
                    <td className="p-3 text-gray-300 text-xs">{ds.useCases[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview Context Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Interview Context (20 LPA Level)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Common Interview Scenarios</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span><strong>Arrays:</strong> Dynamic lists, matrix operations, sliding window problems</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span><strong>HashMaps:</strong> Frequency counting, two-sum problems, caching</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span><strong>Stacks:</strong> Parentheses matching, expression evaluation, DFS</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span><strong>Queues:</strong> BFS, task scheduling, level-order traversal</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span><strong>Trees:</strong> Binary search, path problems, hierarchical data</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span><strong>Graphs:</strong> Network problems, dependency resolution, shortest path</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Using arrays for frequent insertions/deletions</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering space complexity trade-offs</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Choosing complex structures when simple ones work</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not understanding when to use each structure</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Ignoring edge cases and constraints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master Search Algorithms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/linear-search"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* 🟦 Fix: Use a valid icon or fallback emoji if 'Search' is undefined */}
                <span className="w-6 h-6 flex items-center justify-center text-blue-200 text-xl">🔍</span>
                <h3 className="text-xl font-bold">Linear Search</h3>
              </div>
              <p className="text-gray-300">Master sequential search algorithms and their applications.</p>
            </Link>
            <Link 
              href="/binary-search"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* 🟪 Fix: Use a valid icon or fallback emoji if 'Searc' is undefined */}
                <span className="w-6 h-6 flex items-center justify-center text-purple-200 text-xl">🧮</span>
                <h3 className="text-xl font-bold">Binary Search</h3>
              </div>
              <p className="text-gray-300">Learn efficient divide & conquer search techniques.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
