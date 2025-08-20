'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface ComplexityData {
  name: string;
  title: string;
  description: string;
  examples: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  growthRate: (n: number) => number;
}

interface CodeExample {
  id: string;
  name: string;
  description: string;
  complexity: string;
  code: string;
  explanation: string;
  operations: number;
}

export default function BigOPage() {
  const [selectedComplexity, setSelectedComplexity] = useState('O(1)');
  const [inputSize, setInputSize] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);
  const [selectedCodeExample, setSelectedCodeExample] = useState('find-max');
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const complexities: ComplexityData[] = [
    {
      name: 'O(1)',
      title: 'Constant Time',
      description: 'Operations that take the same amount of time regardless of input size',
      examples: ['Array access', 'Hash table lookup', 'Basic arithmetic', 'Object property access'],
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
      growthRate: () => 1
    },
    {
      name: 'O(log n)',
      title: 'Logarithmic Time',
      description: 'Operations that reduce the problem size by half in each step',
      examples: ['Binary search', 'Binary tree search', 'Divide and conquer', 'Heap operations'],
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
      growthRate: (n: number) => Math.log2(n)
    },
    {
      name: 'O(n)',
      title: 'Linear Time',
      description: 'Operations that grow linearly with input size',
      examples: ['Linear search', 'Array traversal', 'Single loop', 'String operations'],
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      growthRate: (n: number) => n
    },
    {
      name: 'O(n log n)',
      title: 'Linearithmic Time',
      description: 'Operations that combine linear and logarithmic growth',
      examples: ['Merge sort', 'Quick sort', 'Heap sort', 'Most efficient comparison sorts'],
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700',
      growthRate: (n: number) => n * Math.log2(n)
    },
    {
      name: 'O(n²)',
      title: 'Quadratic Time',
      description: 'Operations that grow with the square of input size',
      examples: ['Bubble sort', 'Selection sort', 'Nested loops', 'Matrix operations'],
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700',
      growthRate: (n: number) => n * n
    },
    {
      name: 'O(2ⁿ)',
      title: 'Exponential Time',
      description: 'Operations that grow exponentially with input size',
      examples: ['Recursive Fibonacci', 'Subset generation', 'Brute force', 'Traveling salesman'],
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700',
      growthRate: (n: number) => Math.pow(2, n)
    }
  ];

  const codeExamples: CodeExample[] = [
    {
      id: 'find-max',
      name: 'Find Maximum Element',
      description: 'Find the maximum value in an array',
      complexity: 'O(n)',
      code: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}`,
      explanation: 'Single loop through array → Operations grow linearly with n',
      operations: inputSize
    },
    {
      id: 'pair-sum-brute',
      name: 'Check Pair Sum (Brute Force)',
      description: 'Find two numbers that add up to target',
      complexity: 'O(n²)',
      code: `function hasPairWithSum(arr, sum) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === sum) return true;
    }
  }
  return false;
}`,
      explanation: 'Nested loops → Operations grow quadratically with n',
      operations: inputSize * inputSize
    },
    {
      id: 'pair-sum-optimized',
      name: 'Check Pair Sum (Optimized)',
      description: 'Find two numbers that add up to target using HashSet',
      complexity: 'O(n)',
      code: `function hasPairWithSumOptimized(arr, sum) {
  const set = new Set();
  for (let num of arr) {
    if (set.has(sum - num)) return true;
    set.add(num);
  }
  return false;
}`,
      explanation: 'Single loop with HashSet lookup → Operations grow linearly with n',
      operations: inputSize
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      description: 'Find element in sorted array',
      complexity: 'O(log n)',
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      explanation: 'Each step halves the search space → Logarithmic growth',
      operations: Math.log2(inputSize)
    }
  ];

  const selectedComplexityData = complexities.find(c => c.name === selectedComplexity);
  const selectedCodeExampleData = codeExamples.find(e => e.id === selectedCodeExample);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 10) {
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 10));
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                📊 Big O Notation Mastery
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
                  <Clock className="w-5 h-5" />
                  Time Complexity
                </h3>
                <p className="text-gray-300 mb-4">
                  Measures how the runtime of an algorithm grows as the input size increases. 
                  It helps us understand the efficiency of our code.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Example:</strong> A loop that runs n times has O(n) time complexity.
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Space Complexity
                </h3>
                <p className="text-gray-300 mb-4">
                  Measures how much additional memory an algorithm uses relative to the input size.
                  Includes both auxiliary space and input space.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Example:</strong> Creating a new array of size n has O(n) space complexity.
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-yellow-400 mb-4">🏃‍♂️ Visual Analogy: Runners on a Track</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-sm">O(1): Stays at starting line (constant)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">O(log n): Jumps halfway each time (logarithmic)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">O(n): Runs at steady pace (linear)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">O(n log n): Runs with occasional jumps (linearithmic)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                  <span className="text-sm">O(n²): Runs in expanding circles (quadratic)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-sm">O(2ⁿ): Explodes exponentially (exponential)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Complexity Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🔍 Explore Different Complexities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {complexities.map((complexity) => (
              <button
                key={complexity.name}
                onClick={() => setSelectedComplexity(complexity.name)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  selectedComplexity === complexity.name
                    ? `${complexity.bgColor} ${complexity.borderColor} shadow-lg`
                    : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className={`text-2xl font-bold mb-2 ${complexity.color}`}>
                  {complexity.name}
                </div>
                <div className="text-sm text-gray-300">
                  {complexity.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Explanation & Code */}
          <div className="space-y-6">
            {/* Selected Complexity Details */}
            {selectedComplexityData && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center mb-6">
                  <h2 className={`text-4xl font-bold mb-4 ${selectedComplexityData.color}`}>
                    {selectedComplexityData.name}
                  </h2>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedComplexityData.title}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {selectedComplexityData.description}
                  </p>
                </div>

                <div className={`${selectedComplexityData.bgColor} border ${selectedComplexityData.borderColor} rounded-lg p-4`}>
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Common Examples
                  </h4>
                  <ul className="space-y-2">
                    {selectedComplexityData.examples.map((example, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Code Examples */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">💻 Code Examples</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
{`// ${selectedComplexityData?.name} Example
function exampleAlgorithm(arr) {
  // This algorithm has ${selectedComplexityData?.name} complexity
  for (let i = 0; i < arr.length; i++) {
    // Process each element
    console.log(arr[i]);
  }
}

// Time Complexity: ${selectedComplexityData?.name}
// Space Complexity: O(1)`}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Visualization */}
          <div className="space-y-6">
            {/* Input Size Slider */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📊 Interactive Visualization</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Input Size (n): {inputSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={inputSize}
                  onChange={(e) => setInputSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Operations</div>
                  <div className={`text-2xl font-bold ${selectedComplexityData?.color}`}>
                    {selectedComplexityData ? Math.round(selectedComplexityData.growthRate(inputSize)) : 0}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Growth Rate</div>
                  <div className="text-lg font-semibold text-blue-400">
                    {selectedComplexityData?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400">📈 Growth Comparison</h3>
              <div className="bg-gray-700 rounded-lg p-4 h-64 flex items-end justify-center gap-2">
                {complexities.map((complexity, index) => {
                  const height = Math.min(complexity.growthRate(inputSize) / 10, 200);
                  return (
                    <div
                      key={complexity.name}
                      className={`w-8 rounded-t transition-all duration-500 ${
                        selectedComplexity === complexity.name ? 'opacity-100' : 'opacity-50'
                      }`}
                      style={{
                        height: `${height}px`,
                        backgroundColor: complexity.name === 'O(1)' ? '#4ade80' :
                                        complexity.name === 'O(log n)' ? '#60a5fa' :
                                        complexity.name === 'O(n)' ? '#fbbf24' :
                                        complexity.name === 'O(n log n)' ? '#a78bfa' :
                                        complexity.name === 'O(n²)' ? '#fb923c' : '#f87171'
                      }}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                {complexities.map(complexity => (
                  <div key={complexity.name} className={`${complexity.color}`}>
                    {complexity.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">🎮 Animation Controls</h3>
              <div className="flex items-center justify-center space-x-4">
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
                  disabled={currentStep === 10}
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
              
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 10) * 100}%` }}
                  />
                </div>
                <div className="text-center text-sm text-gray-400 mt-2">
                  Step {currentStep} / 10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practical Examples Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">💻 Practical Examples with Code</h2>
          
          {/* Example Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {codeExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedCodeExample(example.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  selectedCodeExample === example.id
                    ? 'bg-blue-900/20 border-blue-500 shadow-lg'
                    : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                }`}
              >
                <h3 className="font-bold text-white mb-2">{example.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{example.description}</p>
                <div className="text-xs font-medium text-green-400">{example.complexity}</div>
              </button>
            ))}
          </div>

          {/* Selected Example Details */}
          {selectedCodeExampleData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {selectedCodeExampleData.name}
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">{selectedCodeExampleData.code}</pre>
                </div>
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <p className="text-sm text-gray-300">{selectedCodeExampleData.explanation}</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Complexity Analysis
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Time Complexity</div>
                    <div className="text-xl font-bold text-green-400">{selectedCodeExampleData.complexity}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Operations for n = {inputSize}</div>
                    <div className="text-xl font-bold text-blue-400">
                      {Math.round(selectedCodeExampleData.operations)}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Space Complexity</div>
                    <div className="text-lg font-semibold text-purple-400">
                      {selectedCodeExampleData.id === 'pair-sum-optimized' ? 'O(n)' : 'O(1)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interview Context Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Interview Context (20 LPA Level)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 What Interviewers Expect</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Analyze time and space complexity of your solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Compare different approaches (brute force vs optimized)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Understand trade-offs between time and space</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Optimize solutions for large-scale systems</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explain your reasoning clearly and concisely</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering edge cases and large inputs</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Focusing only on time complexity, ignoring space</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not being able to explain your solution's complexity</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Choosing the most complex solution when simpler works</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering real-world constraints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Algorithm Comparison Table */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">📊 Algorithm Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Algorithm</th>
                  <th className="text-left p-3 text-gray-300">Time Complexity</th>
                  <th className="text-left p-3 text-gray-300">Space Complexity</th>
                  <th className="text-left p-3 text-gray-300">Best Use Case</th>
                  <th className="text-left p-3 text-gray-300">Interview Level</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-white">Linear Search</td>
                  <td className="p-3 text-red-400">O(n)</td>
                  <td className="p-3 text-green-400">O(1)</td>
                  <td className="p-3 text-gray-300">Small arrays, unsorted data</td>
                  <td className="p-3 text-green-400">Basic</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-white">Binary Search</td>
                  <td className="p-3 text-blue-400">O(log n)</td>
                  <td className="p-3 text-green-400">O(1)</td>
                  <td className="p-3 text-gray-300">Sorted arrays, large datasets</td>
                  <td className="p-3 text-yellow-400">Medium</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-white">Bubble Sort</td>
                  <td className="p-3 text-red-400">O(n²)</td>
                  <td className="p-3 text-green-400">O(1)</td>
                  <td className="p-3 text-gray-300">Educational, small datasets</td>
                  <td className="p-3 text-green-400">Basic</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-white">Quick Sort</td>
                  <td className="p-3 text-purple-400">O(n log n)</td>
                  <td className="p-3 text-yellow-400">O(log n)</td>
                  <td className="p-3 text-gray-300">General purpose sorting</td>
                  <td className="p-3 text-yellow-400">Medium</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-white">Hash Table Lookup</td>
                  <td className="p-3 text-green-400">O(1)</td>
                  <td className="p-3 text-yellow-400">O(n)</td>
                  <td className="p-3 text-gray-300">Fast lookups, unique keys</td>
                  <td className="p-3 text-yellow-400">Medium</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Recursive Fibonacci</td>
                  <td className="p-3 text-red-400">O(2ⁿ)</td>
                  <td className="p-3 text-red-400">O(n)</td>
                  <td className="p-3 text-gray-300">Educational only</td>
                  <td className="p-3 text-red-400">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Practical Examples Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">💻 Practical Examples with Code</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Find Maximum Element (O(n))
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}`}</pre>
              </div>
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-sm text-gray-300">Single loop through array → Operations grow linearly with n</p>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Complexity Analysis
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Time Complexity</div>
                  <div className="text-xl font-bold text-green-400">O(n)</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Operations for n = {inputSize}</div>
                  <div className="text-xl font-bold text-blue-400">{inputSize}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Space Complexity</div>
                  <div className="text-lg font-semibold text-purple-400">O(1)</div>
                </div>
              </div>
            </div>
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 What Interviewers Expect</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Analyze time and space complexity of your solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Compare different approaches (brute force vs optimized)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Understand trade-offs between time and space</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Optimize solutions for large-scale systems</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explain your reasoning clearly and concisely</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering edge cases and large inputs</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Focusing only on time complexity, ignoring space</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not being able to explain your solution's complexity</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Choosing the most complex solution when simpler works</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering real-world constraints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Concepts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/time-complexity"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-bold">Time Complexity</h3>
              </div>
              <p className="text-gray-300">Understand how algorithm runtime grows with input size.</p>
            </Link>
            <Link 
              href="/space-complexity"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6" />
                <h3 className="text-xl font-bold">Space Complexity</h3>
              </div>
              <p className="text-gray-300">Learn about memory usage patterns and optimization.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
