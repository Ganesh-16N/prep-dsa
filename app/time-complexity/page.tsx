'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Search, Database, Layers } from 'lucide-react';

interface ComplexityData {
  name: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  growthRate: (n: number) => number;
  code: string;
  example: string;
  interviewUseCase: string;
}

export default function TimeComplexityPage() {
  const [selectedComplexity, setSelectedComplexity] = useState('O(1)');
  const [inputSize, setInputSize] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const complexities: ComplexityData[] = [
    {
      name: 'O(1)',
      title: 'Constant Time',
      description: 'Runtime stays the same regardless of input size',
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
      growthRate: () => 1,
      code: `function getFirstElement(arr) {
  return arr[0]; // Always 1 operation
}`,
      example: 'Array access, Hash table lookup',
      interviewUseCase: 'Hash lookup, Object property access'
    },
    {
      name: 'O(log n)',
      title: 'Logarithmic Time',
      description: 'Runtime grows logarithmically with input size',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
      growthRate: (n: number) => Math.log2(n),
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      example: 'Binary search, Binary tree operations',
      interviewUseCase: 'Search in sorted database, Divide & conquer'
    },
    {
      name: 'O(n)',
      title: 'Linear Time',
      description: 'Runtime grows linearly with input size',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      growthRate: (n: number) => n,
      code: `function printAll(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}`,
      example: 'Linear search, Array traversal',
      interviewUseCase: 'Traversing data, Single loop operations'
    },
    {
      name: 'O(n log n)',
      title: 'Linearithmic Time',
      description: 'Runtime grows as n times log n',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700',
      growthRate: (n: number) => n * Math.log2(n),
      code: `function sortArray(arr) {
  return arr.sort((a, b) => a - b); // Uses efficient sort
}`,
      example: 'Merge sort, Quick sort, Heap sort',
      interviewUseCase: 'Large-scale sorting, Efficient comparison sorts'
    },
    {
      name: 'O(n²)',
      title: 'Quadratic Time',
      description: 'Runtime grows with the square of input size',
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700',
      growthRate: (n: number) => n * n,
      code: `function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}`,
      example: 'Bubble sort, Selection sort, Nested loops',
      interviewUseCase: 'Matrix operations, Pair comparisons'
    },
    {
      name: 'O(2ⁿ)',
      title: 'Exponential Time',
      description: 'Runtime grows exponentially with input size',
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700',
      growthRate: (n: number) => Math.pow(2, n),
      code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
      example: 'Recursive Fibonacci, Subset generation',
      interviewUseCase: 'Brute force problems, Combinatorial algorithms'
    }
  ];

  const selectedComplexityData = complexities.find(c => c.name === selectedComplexity);

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ⏱️ Time Complexity Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">🎯 What is Time Complexity?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Simple Definition
                </h3>
                <p className="text-gray-300 mb-4 text-lg">
                  <strong>Time Complexity</strong> = How the runtime of an algorithm grows as input size increases.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Point:</strong> We care about the growth rate, not the exact time.
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Why It Matters
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Predict algorithm performance on large inputs</li>
                  <li>• Compare different solutions</li>
                  <li>• Optimize for scalability</li>
                  <li>• Make informed design decisions</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4">🏃‍♂️ Visual Analogy: Runners on a Track</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-sm">O(1): Stays at starting line (constant speed)</span>
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

        {/* Complexity Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🔍 Explore Different Time Complexities</h2>
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

                <div className={`${selectedComplexityData.bgColor} border ${selectedComplexityData.borderColor} rounded-lg p-4 mb-4`}>
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    JavaScript Code Example
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">{selectedComplexityData.code}</pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Examples</h4>
                    <p className="text-sm text-gray-300">{selectedComplexityData.example}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Interview Use Case</h4>
                    <p className="text-sm text-gray-300">{selectedComplexityData.interviewUseCase}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Real-world Examples */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">🌍 Real-world Examples</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Array Lookup (O(1))</h4>
                  <p className="text-sm text-gray-300">Accessing any element by index is constant time</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Search: Unsorted vs Sorted</h4>
                  <p className="text-sm text-gray-300">Linear search (O(n)) vs Binary search (O(log n))</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Sorting Algorithms</h4>
                  <p className="text-sm text-gray-300">Efficient sorts like Merge Sort achieve O(n log n)</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Brute Force Recursion</h4>
                  <p className="text-sm text-gray-300">Recursive Fibonacci without memoization is O(2ⁿ)</p>
                </div>
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
                  max="20"
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
                  const height = Math.min(complexity.growthRate(inputSize) / 5, 200);
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
                  <span>Analyze time complexity of your solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Compare brute force vs optimized approaches</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Understand scalability implications</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Optimize for large-scale systems</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explain your reasoning clearly</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering large input sizes</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Focusing only on small test cases</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not being able to explain complexity</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Choosing inefficient solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Ignoring real-world constraints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">📊 Time Complexity Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Complexity</th>
                  <th className="text-left p-3 text-gray-300">Example</th>
                  <th className="text-left p-3 text-gray-300">Interview Use Case</th>
                  <th className="text-left p-3 text-gray-300">Performance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-green-400 font-bold">O(1)</td>
                  <td className="p-3 text-white">Array access</td>
                  <td className="p-3 text-gray-300">Hash lookup, Object property access</td>
                  <td className="p-3 text-green-400">Excellent</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-blue-400 font-bold">O(log n)</td>
                  <td className="p-3 text-white">Binary Search</td>
                  <td className="p-3 text-gray-300">Search in sorted database</td>
                  <td className="p-3 text-blue-400">Very Good</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-yellow-400 font-bold">O(n)</td>
                  <td className="p-3 text-white">Loop</td>
                  <td className="p-3 text-gray-300">Traversing data</td>
                  <td className="p-3 text-yellow-400">Good</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-purple-400 font-bold">O(n log n)</td>
                  <td className="p-3 text-white">Merge Sort</td>
                  <td className="p-3 text-gray-300">Large-scale sorting</td>
                  <td className="p-3 text-purple-400">Acceptable</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-orange-400 font-bold">O(n²)</td>
                  <td className="p-3 text-white">Nested loops</td>
                  <td className="p-3 text-gray-300">Matrix operations</td>
                  <td className="p-3 text-orange-400">Poor</td>
                </tr>
                <tr>
                  <td className="p-3 text-red-400 font-bold">O(2ⁿ)</td>
                  <td className="p-3 text-white">Recursive Fibonacci</td>
                  <td className="p-3 text-gray-300">Brute force problems</td>
                  <td className="p-3 text-red-400">Very Poor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Optimization Examples */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">⚡ Brute Force → Optimized Approach</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Brute Force Approach
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
                <pre className="text-gray-300">{`// O(n²) - Brute Force
function hasPairWithSum(arr, sum) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === sum) return true;
    }
  }
  return false;
}`}</pre>
              </div>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Time Complexity: O(n²)</li>
                <li>• Space Complexity: O(1)</li>
                <li>• Checks every possible pair</li>
                <li>• Inefficient for large arrays</li>
              </ul>
            </div>
            
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Optimized Approach
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
                <pre className="text-gray-300">{`// O(n) - Optimized with HashSet
function hasPairWithSumOptimized(arr, sum) {
  const set = new Set();
  for (let num of arr) {
    if (set.has(sum - num)) return true;
    set.add(num);
  }
  return false;
}`}</pre>
              </div>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Time Complexity: O(n)</li>
                <li>• Space Complexity: O(n)</li>
                <li>• Uses HashSet for O(1) lookup</li>
                <li>• Much more efficient</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Concepts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/space-complexity"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6" />
                <h3 className="text-xl font-bold">Space Complexity</h3>
              </div>
              <p className="text-gray-300">Understand memory usage patterns and optimization strategies.</p>
            </Link>
            <Link 
              href="/data-structures"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-bold">Data Structures Overview</h3>
              </div>
              <p className="text-gray-300">Learn about arrays, strings, objects and their operations.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
