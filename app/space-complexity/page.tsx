'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Search, Database, HardDrive, Layers, Box } from 'lucide-react';

interface SpaceComplexityData {
  name: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  memoryUsage: (n: number) => number;
  code: string;
  example: string;
  interviewUseCase: string;
  memoryBreakdown: {
    input: string;
    auxiliary: string;
    stack: string;
    structures: string;
  };
}

export default function SpaceComplexityPage() {
  const [selectedComplexity, setSelectedComplexity] = useState('O(1)');
  const [inputSize, setInputSize] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showMemoryBoxes, setShowMemoryBoxes] = useState(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const spaceComplexities: SpaceComplexityData[] = [
    {
      name: 'O(1)',
      title: 'Constant Space',
      description: 'Uses a fixed amount of extra memory regardless of input size',
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
      memoryUsage: () => 1,
      code: `function sum(arr) {
  let total = 0; // Only one variable, constant space
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
      example: 'Single variable operations, in-place algorithms',
      interviewUseCase: 'In-place array reversal, swap operations',
      memoryBreakdown: {
        input: 'O(n) - Input array',
        auxiliary: 'O(1) - Single variable',
        stack: 'O(1) - No recursion',
        structures: 'O(1) - No extra structures'
      }
    },
    {
      name: 'O(log n)',
      title: 'Logarithmic Space',
      description: 'Memory usage grows logarithmically with input size',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
      memoryUsage: (n: number) => Math.log2(n),
      code: `function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  let mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) 
    return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}`,
      example: 'Recursive binary search, divide & conquer',
      interviewUseCase: 'Divide & conquer stack usage, recursive algorithms',
      memoryBreakdown: {
        input: 'O(n) - Input array',
        auxiliary: 'O(1) - Mid variable',
        stack: 'O(log n) - Recursive call stack',
        structures: 'O(1) - No extra structures'
      }
    },
    {
      name: 'O(n)',
      title: 'Linear Space',
      description: 'Memory usage grows linearly with input size',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      memoryUsage: (n: number) => n,
      code: `function squareArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i] * arr[i]); // New array takes O(n) space
  }
  return result;
}`,
      example: 'HashSet, Array copy, Dynamic Programming',
      interviewUseCase: 'Detect duplicates, DP problems, result storage',
      memoryBreakdown: {
        input: 'O(n) - Input array',
        auxiliary: 'O(1) - Loop variable',
        stack: 'O(1) - No recursion',
        structures: 'O(n) - Result array'
      }
    },
    {
      name: 'O(n²)',
      title: 'Quadratic Space',
      description: 'Memory usage grows with the square of input size',
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700',
      memoryUsage: (n: number) => n * n,
      code: `function createMatrix(n) {
  let matrix = [];
  for (let i = 0; i < n; i++) {
    matrix.push(new Array(n).fill(0));
  }
  return matrix; // Takes n * n space
}`,
      example: '2D matrices, adjacency matrices, nested structures',
      interviewUseCase: 'Graph adjacency matrix, 2D DP tables',
      memoryBreakdown: {
        input: 'O(n) - Input size',
        auxiliary: 'O(1) - Loop variables',
        stack: 'O(1) - No recursion',
        structures: 'O(n²) - 2D matrix'
      }
    },
    {
      name: 'O(2ⁿ)',
      title: 'Exponential Space',
      description: 'Memory usage grows exponentially with input size',
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700',
      memoryUsage: (n: number) => Math.pow(2, n),
      code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // Each call spawns 2 more calls
}`,
      example: 'Recursive Fibonacci, subset generation',
      interviewUseCase: 'Brute force recursion, combinatorial algorithms',
      memoryBreakdown: {
        input: 'O(1) - Single number',
        auxiliary: 'O(1) - No extra variables',
        stack: 'O(2ⁿ) - Exponential call stack',
        structures: 'O(1) - No extra structures'
      }
    }
  ];

  const selectedComplexityData = spaceComplexities.find(c => c.name === selectedComplexity);

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                💾 Space Complexity Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-purple-400">🎯 What is Space Complexity?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Definition
                </h3>
                <p className="text-gray-300 mb-4 text-lg">
                  <strong>Space Complexity</strong> = How much extra memory an algorithm uses as input size grows.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Point:</strong> We focus on auxiliary space, not input storage.
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Why It Matters
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Memory constraints in production systems</li>
                  <li>• Scalability considerations</li>
                  <li>• Performance trade-offs</li>
                  <li>• Resource optimization</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4">📦 Visual Analogy: Memory Shelves</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-sm">O(1): One small box (constant space)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">O(log n): Few boxes (logarithmic growth)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">O(n): Row of boxes (linear growth)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                  <span className="text-sm">O(n²): Grid of boxes (quadratic growth)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-sm">O(2ⁿ): Exploding boxes (exponential growth)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Breakdown */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">🧠 Memory Breakdown Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Box className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-blue-400">Input Storage</h3>
              </div>
              <p className="text-gray-300 text-sm">Space needed to store the input data (usually O(n) for arrays)</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-green-400" />
                <h3 className="font-bold text-green-400">Auxiliary Variables</h3>
              </div>
              <p className="text-gray-300 text-sm">Extra variables like counters, accumulators, temporary values</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold text-purple-400">Function Call Stack</h3>
              </div>
              <p className="text-gray-300 text-sm">Memory used by recursive function calls and their parameters</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-orange-400" />
                <h3 className="font-bold text-orange-400">Data Structures</h3>
              </div>
              <p className="text-gray-300 text-sm">Extra arrays, maps, sets, or other structures created during execution</p>
            </div>
          </div>
        </div>

        {/* Complexity Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🔍 Explore Different Space Complexities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {spaceComplexities.map((complexity) => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Examples</h4>
                    <p className="text-sm text-gray-300">{selectedComplexityData.example}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Interview Use Case</h4>
                    <p className="text-sm text-gray-300">{selectedComplexityData.interviewUseCase}</p>
                  </div>
                </div>

                {/* Memory Breakdown for Selected Complexity */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3">Memory Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Input Storage:</span>
                      <span className="text-blue-400">{selectedComplexityData.memoryBreakdown.input}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Auxiliary Variables:</span>
                      <span className="text-green-400">{selectedComplexityData.memoryBreakdown.auxiliary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Function Call Stack:</span>
                      <span className="text-purple-400">{selectedComplexityData.memoryBreakdown.stack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Data Structures:</span>
                      <span className="text-orange-400">{selectedComplexityData.memoryBreakdown.structures}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-world Examples */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">🌍 Real-world Examples</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">In-place vs New Array</h4>
                  <p className="text-sm text-gray-300">Reversing array in-place (O(1)) vs creating new array (O(n))</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Recursive vs Iterative</h4>
                  <p className="text-sm text-gray-300">Binary search recursive (O(log n) stack) vs iterative (O(1))</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">HashMap vs Two Pointers</h4>
                  <p className="text-sm text-gray-300">HashSet solution (O(n) space) vs sorting + two pointers (O(1))</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Dynamic Programming</h4>
                  <p className="text-sm text-gray-300">Memoization (O(n) space) vs tabulation (O(n) space)</p>
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
                  max="15"
                  value={inputSize}
                  onChange={(e) => setInputSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Memory Units</div>
                  <div className={`text-2xl font-bold ${selectedComplexityData?.color}`}>
                    {selectedComplexityData ? Math.round(selectedComplexityData.memoryUsage(inputSize)) : 0}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Space Complexity</div>
                  <div className="text-lg font-semibold text-blue-400">
                    {selectedComplexityData?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Usage Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400">📈 Memory Usage Comparison</h3>
              <div className="bg-gray-700 rounded-lg p-4 h-64 flex items-end justify-center gap-2">
                {spaceComplexities.map((complexity, index) => {
                  const height = Math.min(complexity.memoryUsage(inputSize) / 10, 200);
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
                                        complexity.name === 'O(n²)' ? '#fb923c' : '#f87171'
                      }}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                {spaceComplexities.map(complexity => (
                  <div key={complexity.name} className={`${complexity.color}`}>
                    {complexity.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Boxes Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">📦 Memory Boxes Visualization</h3>
              <div className="bg-gray-700 rounded-lg p-4 h-48 overflow-hidden">
                <div className="grid grid-cols-5 gap-1 h-full">
                  {Array.from({ length: selectedComplexityData ? Math.min(selectedComplexityData.memoryUsage(inputSize), 25) : 1 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded transition-all duration-300 ${
                        selectedComplexityData?.name === 'O(1)' ? 'bg-green-400' :
                        selectedComplexityData?.name === 'O(log n)' ? 'bg-blue-400' :
                        selectedComplexityData?.name === 'O(n)' ? 'bg-yellow-400' :
                        selectedComplexityData?.name === 'O(n²)' ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{
                        opacity: i < (selectedComplexityData ? Math.min(selectedComplexityData.memoryUsage(inputSize), 25) : 1) ? 1 : 0.3
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="text-center text-sm text-gray-400 mt-2">
                Memory boxes: {selectedComplexityData ? Math.round(selectedComplexityData.memoryUsage(inputSize)) : 0}
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
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
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
                  <span>Analyze space complexity of your solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Compare in-place vs extra space approaches</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Understand memory constraints in production</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Optimize for memory efficiency</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explain space-time trade-offs</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Ignoring memory usage in solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering stack space in recursion</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Creating unnecessary data structures</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not optimizing for memory constraints</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Focusing only on time complexity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">📊 Space Complexity Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Complexity</th>
                  <th className="text-left p-3 text-gray-300">Example</th>
                  <th className="text-left p-3 text-gray-300">Interview Use Case</th>
                  <th className="text-left p-3 text-gray-300">Memory Efficiency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-green-400 font-bold">O(1)</td>
                  <td className="p-3 text-white">Swap variables</td>
                  <td className="p-3 text-gray-300">In-place array reversal</td>
                  <td className="p-3 text-green-400">Excellent</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-blue-400 font-bold">O(log n)</td>
                  <td className="p-3 text-white">Recursive binary search</td>
                  <td className="p-3 text-gray-300">Divide & conquer stack usage</td>
                  <td className="p-3 text-blue-400">Very Good</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-yellow-400 font-bold">O(n)</td>
                  <td className="p-3 text-white">HashSet / Array copy</td>
                  <td className="p-3 text-gray-300">Detect duplicates, DP problems</td>
                  <td className="p-3 text-yellow-400">Good</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-orange-400 font-bold">O(n²)</td>
                  <td className="p-3 text-white">Matrix allocation</td>
                  <td className="p-3 text-gray-300">Graph adjacency matrix</td>
                  <td className="p-3 text-orange-400">Poor</td>
                </tr>
                <tr>
                  <td className="p-3 text-red-400 font-bold">O(2ⁿ)</td>
                  <td className="p-3 text-white">Recursive Fibonacci</td>
                  <td className="p-3 text-gray-300">Brute force recursion</td>
                  <td className="p-3 text-red-400">Very Poor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Optimization Examples */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">⚡ Memory Optimization Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Memory-Intensive Approach
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
                <pre className="text-gray-300">{`// O(n) Space - Creating new array
function reverseArray(arr) {
  let result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}`}</pre>
              </div>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Space Complexity: O(n)</li>
                <li>• Creates new array</li>
                <li>• Uses extra memory</li>
                <li>• Not memory efficient</li>
              </ul>
            </div>
            
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Memory-Optimized Approach
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
                <pre className="text-gray-300">{`// O(1) Space - In-place reversal
function reverseArrayInPlace(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++; right--;
  }
  return arr;
}`}</pre>
              </div>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Space Complexity: O(1)</li>
                <li>• Modifies array in-place</li>
                <li>• Uses only 2 variables</li>
                <li>• Memory efficient</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Real-world Interview Questions */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">🎯 Real-world Interview Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-blue-400 mb-3">Question 1: Two Sum with Space Constraints</h3>
              <p className="text-gray-300 mb-4">Find two numbers that add up to target. Compare HashMap vs Two Pointers approach.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">HashMap Solution</h4>
                  <p className="text-sm text-gray-300">Time: O(n), Space: O(n)</p>
                  <p className="text-sm text-gray-300">Uses HashSet for O(1) lookup</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">Two Pointers Solution</h4>
                  <p className="text-sm text-gray-300">Time: O(n log n), Space: O(1)</p>
                  <p className="text-sm text-gray-300">Sort first, then use two pointers</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-purple-400 mb-3">Question 2: Recursive vs Iterative Binary Search</h3>
              <p className="text-gray-300 mb-4">Implement binary search. Compare stack space usage.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Recursive Approach</h4>
                  <p className="text-sm text-gray-300">Time: O(log n), Space: O(log n)</p>
                  <p className="text-sm text-gray-300">Uses call stack for recursion</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Iterative Approach</h4>
                  <p className="text-sm text-gray-300">Time: O(log n), Space: O(1)</p>
                  <p className="text-sm text-gray-300">Uses only loop variables</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-orange-400 mb-3">Question 3: Dynamic Programming Space Optimization</h3>
              <p className="text-gray-300 mb-4">Fibonacci sequence. Compare memoization vs tabulation vs optimized.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Recursive</h4>
                  <p className="text-sm text-gray-300">Time: O(2ⁿ), Space: O(n)</p>
                  <p className="text-sm text-gray-300">Exponential time, linear stack</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">Memoization</h4>
                  <p className="text-sm text-gray-300">Time: O(n), Space: O(n)</p>
                  <p className="text-sm text-gray-300">Hash table + call stack</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Optimized</h4>
                  <p className="text-sm text-gray-300">Time: O(n), Space: O(1)</p>
                  <p className="text-sm text-gray-300">Only 2 variables needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Concepts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/data-structures"
              className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-bold">Data Structures Overview</h3>
              </div>
              <p className="text-gray-300">Learn about arrays, strings, objects and their operations.</p>
            </Link>
            <Link 
              href="/linear-search"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6" />
                <h3 className="text-xl font-bold">Linear Search</h3>
              </div>
              <p className="text-gray-300">Master sequential search algorithms and their applications.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
