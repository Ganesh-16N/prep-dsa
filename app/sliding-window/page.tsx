'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, ArrowUpDown, ArrowRight, Search, Repeat, Layers, GitBranch } from 'lucide-react';

interface WindowState {
  start: number;
  end: number;
  sum: number;
  highlighted: number[];
  description: string;
  step: number;
}

export default function SlidingWindowPage() {
  const [array, setArray] = useState<number[]>([2, 1, 5, 1, 3, 2]);
  const [windowSize, setWindowSize] = useState<number>(3);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showOptimized, setShowOptimized] = useState<boolean>(false);
  const [windowStates, setWindowStates] = useState<WindowState[]>([]);
  const [maxSum, setMaxSum] = useState<number>(0);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate window states for the current array and window size
  useEffect(() => {
    const states: WindowState[] = [];
    let maxSumFound = 0;
    
    for (let i = 0; i <= array.length - windowSize; i++) {
      const windowElements = array.slice(i, i + windowSize);
      const sum = windowElements.reduce((acc, val) => acc + val, 0);
      maxSumFound = Math.max(maxSumFound, sum);
      
      states.push({
        start: i,
        end: i + windowSize - 1,
        sum,
        highlighted: windowElements.map((_, index) => i + index),
        description: `Window [${i}, ${i + windowSize - 1}]: sum = ${sum}`,
        step: i
      });
    }
    
    setWindowStates(states);
    setMaxSum(maxSumFound);
    setCurrentStep(0);
  }, [array, windowSize]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= windowStates.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
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
  }, [isPlaying, windowStates.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, windowStates.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10) + 1);
    setArray(newArray);
  };

  const updateArray = (newArray: string) => {
    const parsed = newArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (parsed.length > 0) {
      setArray(parsed);
    }
  };

  const currentWindow = windowStates[currentStep];

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
                🪟 Sliding Window Pattern Mastery
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
                  <span role="img" aria-label="window" className="w-5 h-5">🪟</span>
                  What is Sliding Window?
                </h3>
                <p className="text-gray-300 mb-4">
                  A technique to reduce nested loops by maintaining a 'window' of elements that slides 
                  across the input instead of recomputing from scratch.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Analogy:</strong> A window sliding across an array of houses — only a few houses are visible at once.
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Why Use Sliding Window?
                </h3>
                <p className="text-gray-300 mb-4">
                  Reduces brute force O(n²) to optimized O(n). Common in subarray problems, 
                  string problems, and streaming data.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Benefit:</strong> Avoids recomputation by reusing previous window's data.
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-yellow-400 mb-4">📊 Optimization Comparison</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-red-400">Brute Force Approach</h4>
                  <p className="text-sm text-gray-300">Calculate sum for each window independently</p>
                  <div className="text-xs text-gray-400">Time: O(n × k) | Space: O(1)</div>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-400">Sliding Window Approach</h4>
                  <p className="text-sm text-gray-300">Reuse previous window's sum, add new element, subtract old element</p>
                  <div className="text-xs text-gray-400">Time: O(n) | Space: O(1)</div>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-400">Performance Gain</h4>
                  <p className="text-sm text-gray-300">From quadratic to linear time complexity</p>
                  <div className="text-xs text-gray-400">Especially significant for large arrays</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Toggle */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setShowOptimized(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                !showOptimized
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔥 Brute Force Approach
            </button>
            <button
              onClick={() => setShowOptimized(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                showOptimized
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ⚡ Sliding Window Optimized
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">🎛️ Interactive Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Array Elements
              </label>
              <input
                type="text"
                value={array.join(', ')}
                onChange={(e) => updateArray(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2, 1, 5, 1, 3, 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Window Size (k)
              </label>
              <input
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(Math.max(1, Math.min(array.length, parseInt(e.target.value) || 3)))}
                min="1"
                max={array.length}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateRandomArray}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
              >
                🎲 Random Array
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={reset}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Array Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400">📊 Array Visualization</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {array.map((value, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${
                      currentWindow?.highlighted.includes(index)
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg scale-110'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
              
              {/* Window Indicators */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Current Window</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span>Other Elements</span>
                </div>
              </div>
            </div>

            {/* Window Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">📈 Window Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Current Sum</div>
                  <div className="text-2xl font-bold text-green-400">{currentWindow?.sum || 0}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Maximum Sum</div>
                  <div className="text-2xl font-bold text-red-400">{maxSum}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Window Range</div>
                  <div className="text-lg font-semibold text-blue-400">
                    [{currentWindow?.start || 0}, {currentWindow?.end || 0}]
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Step</div>
                  <div className="text-lg font-semibold text-purple-400">
                    {currentStep + 1} / {windowStates.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">🎮 Playback Controls</h3>
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
                  disabled={currentStep === windowStates.length - 1}
                  className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / windowStates.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Code & Explanation */}
          <div className="space-y-6">
            {/* Code Display */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">💻 Algorithm Code</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
{showOptimized ? 
`function maxSubarraySumSlidingWindow(arr, k) {
  let maxSum = 0;
  let windowSum = 0;

  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide the window
  for (let end = k; end < arr.length; end++) {
    windowSum += arr[end] - arr[end - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}` :
`function maxSubarraySumBruteForce(arr, k) {
  let maxSum = -Infinity;
  
  for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += arr[j];
    }
    maxSum = Math.max(maxSum, sum);
  }
  
  return maxSum;
}`}
                </pre>
              </div>
            </div>

            {/* Algorithm Explanation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">
                {showOptimized ? '⚡ Sliding Window Optimization' : '🔥 Brute Force Approach'}
              </h3>
              
              <div className="space-y-4">
                {showOptimized ? (
                  <div className="space-y-4">
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <h4 className="font-bold text-green-400 mb-2">✅ Optimization Benefits:</h4>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Reuses previous window's sum</li>
                        <li>• Only adds new element and subtracts old element</li>
                        <li>• Time Complexity: O(n)</li>
                        <li>• Space Complexity: O(1)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-blue-400 mb-2">🎯 How it works:</h4>
                      <p className="text-gray-300 text-sm">
                        Instead of recalculating the sum each time, we slide the window by
                        subtracting the leftmost element and adding the new rightmost element.
                        This gives us the new window sum in constant time!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                      <h4 className="font-bold text-red-400 mb-2">❌ Problems with Brute Force:</h4>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Calculates sum for every possible subarray</li>
                        <li>• Time Complexity: O(n × k)</li>
                        <li>• Lots of redundant calculations</li>
                        <li>• Inefficient for large arrays</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-yellow-400 mb-2">🔍 How it works:</h4>
                      <p className="text-gray-300 text-sm">
                        For each starting position, calculate the sum of k consecutive elements.
                        This means we're doing the same calculations over and over again.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complexity Comparison */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-pink-400">⏱️ Performance Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Brute Force</h4>
                  <div className="text-2xl font-bold text-red-400">O(n × k)</div>
                  <div className="text-sm text-gray-400 mt-1">Quadratic time</div>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Sliding Window</h4>
                  <div className="text-2xl font-bold text-green-400">O(n)</div>
                  <div className="text-sm text-gray-400 mt-1">Linear time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-indigo-400">📝 Step-by-Step Walkthrough</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {windowStates.map((state, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  index === currentStep
                    ? 'bg-blue-900/20 border-blue-500 shadow-lg'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="text-sm text-gray-400">Step {index + 1}</div>
                <div className="text-lg font-bold text-white">
                  Sum: {state.sum}
                </div>
                <div className="text-sm text-gray-300">
                  [{state.start}, {state.end}]
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Elements: {array.slice(state.start, state.end + 1).join(', ')}
                </div>
              </div>
            ))}
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Common Interview Problems</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Maximum sum subarray of size k</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Longest substring without repeating characters</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Smallest subarray with sum ≥ target</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Fixed-size window problems</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Variable-size window problems</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering edge cases (empty array, k {'>'} array length)</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Using brute force when sliding window is applicable</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not understanding when to use fixed vs variable window</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Forgetting to handle negative numbers properly</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not optimizing the window sliding operation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Problem Solving Patterns?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/iteration-vs-recursion"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Repeat className="w-6 h-6" />
                <h3 className="text-xl font-bold">Iteration vs Recursion</h3>
              </div>
              <p className="text-gray-300">Master the differences between iterative and recursive approaches.</p>
            </Link>
            <Link 
              href="/brute-force"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6" />
                <h3 className="text-xl font-bold">Brute Force Approach</h3>
              </div>
              <p className="text-gray-300">Learn exhaustive search strategies and when to use them.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}