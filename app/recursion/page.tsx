'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Repeat, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, TrendingUp, Layers, GitBranch, Brain } from 'lucide-react';

interface CallStackFrame {
  functionName: string;
  parameter: number;
  returnValue?: number;
  isActive: boolean;
  isReturning: boolean;
  depth: number;
  description: string;
}

interface RecursionExample {
  id: string;
  name: string;
  description: string;
  code: string;
  baseCase: string;
  recursiveCase: string;
  timeComplexity: string;
  spaceComplexity: string;
  visualExample: string;
  input: number;
  steps: CallStackFrame[];
}

export default function RecursionPage() {
  const [selectedExample, setSelectedExample] = useState('factorial');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState(4);
  const [showCallStack, setShowCallStack] = useState(true);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const examples: RecursionExample[] = [
    {
      id: 'factorial',
      name: 'Factorial',
      description: 'Calculate n! using recursion',
      code: `function factorial(n) {
  if (n === 0) return 1; // Base case
  return n * factorial(n - 1); // Recursive case
}`,
      baseCase: 'n === 0 → return 1',
      recursiveCase: 'n * factorial(n - 1)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      visualExample: 'factorial(4) = 4 × 3 × 2 × 1 = 24',
      input: 4,
      steps: []
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      description: 'Calculate nth Fibonacci number',
      code: `function fib(n) {
  if (n <= 1) return n; // Base case
  return fib(n - 1) + fib(n - 2); // Recursive case
}`,
      baseCase: 'n <= 1 → return n',
      recursiveCase: 'fib(n-1) + fib(n-2)',
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n)',
      visualExample: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3',
      input: 4,
      steps: []
    },
    {
      id: 'sum',
      name: 'Sum of Numbers',
      description: 'Calculate sum from 1 to n',
      code: `function sumRecursive(n) {
  if (n === 0) return 0; // Base case
  return n + sumRecursive(n - 1); // Recursive case
}`,
      baseCase: 'n === 0 → return 0',
      recursiveCase: 'n + sumRecursive(n - 1)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      visualExample: 'sum(4) = 4 + 3 + 2 + 1 = 10',
      input: 4,
      steps: []
    }
  ];

  const currentExample = examples.find(e => e.id === selectedExample) || examples[0];

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🔄 Recursion Fundamentals Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-3">
            <Repeat className="w-8 h-8" />
            What is Recursion?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                <strong className="text-purple-400">Recursion</strong> is a function that calls itself until a base condition is met. 
                It's like solving a problem by breaking it into smaller, similar subproblems.
              </p>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  🪆 Visual Analogy
                </h3>
                <p className="text-gray-300">
                  Think of <strong>Russian nesting dolls</strong> or <strong>mirrors facing each other</strong>. 
                  Each doll contains a smaller doll inside, just like each recursive call contains a smaller problem.
                </p>
              </div>

              <div className="bg-pink-900/20 border border-pink-700 rounded-lg p-6">
                <h3 className="font-bold text-pink-400 mb-4 flex items-center gap-2">
                  ⚡ Key Components
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300"><strong>Base Case:</strong> The stopping point (smallest problem)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300"><strong>Recursive Case:</strong> Function calling itself with smaller input</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Advantages
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Elegant and readable code</li>
                  <li>• Natural for tree/graph problems</li>
                  <li>• Matches mathematical definitions</li>
                  <li>• Good for divide & conquer</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Disadvantages
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Stack overflow for deep recursion</li>
                  <li>• Can be less efficient than iteration</li>
                  <li>• Harder to debug sometimes</li>
                  <li>• Memory overhead from call stack</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example Selector */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">🎯 Choose a Recursion Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedExample === example.id
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <h3 className="font-bold mb-2">{example.name}</h3>
                <p className="text-sm opacity-80">{example.description}</p>
                <div className="mt-2 text-xs">
                  <span className="text-red-400">Time: {example.timeComplexity}</span>
                  <span className="mx-2">|</span>
                  <span className="text-blue-400">Space: {example.spaceComplexity}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Code & Explanation */}
          <div className="space-y-8">
            {/* Code Example */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Recursive Implementation
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{currentExample.code}</pre>
              </div>
            </div>

            {/* Base Case vs Recursive Case */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                Recursion Components
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Base Case</h4>
                  <p className="text-gray-300 text-sm">{currentExample.baseCase}</p>
                  <p className="text-xs text-gray-400 mt-1">Stopping condition</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Recursive Case</h4>
                  <p className="text-gray-300 text-sm">{currentExample.recursiveCase}</p>
                  <p className="text-xs text-gray-400 mt-1">Function calling itself</p>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Complexity Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Time Complexity</h4>
                  <p className="text-2xl font-bold text-white">{currentExample.timeComplexity}</p>
                  <p className="text-sm text-gray-300 mt-1">Function calls</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Space Complexity</h4>
                  <p className="text-2xl font-bold text-white">{currentExample.spaceComplexity}</p>
                  <p className="text-sm text-gray-300 mt-1">Call stack depth</p>
                </div>
              </div>
            </div>

            {/* Visual Example */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <Target className="w-6 h-6" />
                How It Works
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-300">{currentExample.visualExample}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Call Stack */}
          <div className="space-y-8">
            {/* Controls */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <Play className="w-6 h-6" />
                Interactive Controls
              </h3>
              
              <div className="flex items-center gap-4 mb-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Play
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                  Previous
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  Next
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">Input Value</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-300 mt-1">{inputValue}</div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Current Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Step:</span>
                  <span className="text-white font-bold">1 / 8</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Call Stack Depth:</span>
                  <span className="text-purple-400 font-bold">0</span>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    Ready to start recursion visualization...
                  </p>
                </div>
              </div>
            </div>

            {/* Call Stack Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                Call Stack Visualization
              </h3>
              
              <div className="bg-gray-900 rounded-lg p-4 min-h-[300px] flex flex-col-reverse justify-end">
                <div className="text-center text-gray-500">
                  Call stack will be visualized here...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Recursion?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/iteration-vs-recursion"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Iteration vs Recursion</h3>
              </div>
              <p className="text-gray-300">Learn when to use loops vs recursive functions.</p>
            </Link>
            <Link 
              href="/base-cases"
              className="bg-pink-600 hover:bg-pink-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <GitBranch className="w-6 h-6" />
                <h3 className="text-xl font-bold">Base Cases & Recursive Cases</h3>
              </div>
              <p className="text-gray-300">Master recursion termination logic and patterns.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
