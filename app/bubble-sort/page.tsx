'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, ArrowUpDown } from 'lucide-react';

interface SortStep {
  array: number[];
  comparing: number[];
  swapped: boolean;
  pass: number;
  step: number;
  description: string;
  sortedElements: number[];
}

export default function BubbleSortPage() {
  const [array, setArray] = useState<number[]>([5, 3, 8, 4, 2]);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [arraySize, setArraySize] = useState<number>(5);
  const [showOptimized, setShowOptimized] = useState<boolean>(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate bubble sort steps
  const generateSortSteps = (inputArray: number[]) => {
    const steps: SortStep[] = [];
    const arr = [...inputArray];
    const n = arr.length;
    let stepCount = 0;
    
    // Add initial state
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: false,
      pass: 0,
      step: stepCount++,
      description: 'Initial array',
      sortedElements: []
    });

    for (let i = 0; i < n - 1; i++) {
      let swappedInPass = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        // Add comparison step
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: false,
          pass: i + 1,
          step: stepCount++,
          description: `Pass ${i + 1}: Comparing ${arr[j]} and ${arr[j + 1]}`,
          sortedElements: arr.slice(n - i, n)
        });

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swappedInPass = true;
          
          // Add swap step
          steps.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapped: true,
            pass: i + 1,
            step: stepCount++,
            description: `Pass ${i + 1}: Swapped ${arr[j]} and ${arr[j + 1]}`,
            sortedElements: arr.slice(n - i, n)
          });
        }
      }
      
      // Add pass completion step
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: false,
        pass: i + 1,
        step: stepCount++,
        description: `Pass ${i + 1} complete. Largest element ${arr[n - i - 1]} is now in position.`,
        sortedElements: arr.slice(n - i - 1, n)
      });
    }
    
    // Add final sorted state
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: false,
      pass: n - 1,
      step: stepCount++,
      description: 'Array is now sorted!',
      sortedElements: arr
    });

    return steps;
  };

  // Update sort steps when array changes
  useEffect(() => {
    const steps = generateSortSteps(array);
    setSortSteps(steps);
    setCurrentStep(0);
  }, [array]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= sortSteps.length - 1) {
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
  }, [isPlaying, sortSteps.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, sortSteps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 20) + 1);
    setArray(newArray);
  };

  const updateArray = (newArray: string) => {
    const parsed = newArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (parsed.length > 0) {
      setArray(parsed);
    }
  };

  const currentStepData = sortSteps[currentStep];

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
                🫧 Bubble Sort Mastery
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
                  <ArrowUpDown className="w-5 h-5" />
                  What is Bubble Sort?
                </h3>
                <p className="text-gray-300 mb-4">
                  Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, 
                  compares adjacent elements, and swaps them if they are in the wrong order.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Analogy:</strong> Like bubbles rising to the top - larger numbers "bubble up" to the right side after each pass.
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  How It Works
                </h3>
                <p className="text-gray-300 mb-4">
                  After each pass, the largest unsorted element "bubbles up" to its correct position. 
                  The algorithm continues until no more swaps are needed.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Insight:</strong> Each pass fixes one element in its final position.
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-yellow-400 mb-4">📊 Step-by-Step Process</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-400">Pass 1</h4>
                  <p className="text-sm text-gray-300">Compare adjacent elements and swap if needed. Largest element moves to end.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-400">Pass 2</h4>
                  <p className="text-sm text-gray-300">Repeat for remaining elements. Second largest moves to second-to-last position.</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-purple-400">Continue</h4>
                  <p className="text-sm text-gray-300">Repeat until no swaps are needed. Array becomes sorted.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-400">Optimization</h4>
                  <p className="text-sm text-gray-300">Stop early if no swaps occur in a pass (array is already sorted).</p>
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
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔥 Basic Bubble Sort
            </button>
            <button
              onClick={() => setShowOptimized(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                showOptimized
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ⚡ Optimized Bubble Sort
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
                placeholder="5, 3, 8, 4, 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Array Size
              </label>
              <input
                type="number"
                value={arraySize}
                onChange={(e) => setArraySize(Math.max(2, Math.min(10, parseInt(e.target.value) || 5)))}
                min="2"
                max="10"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Array Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400">📊 Array Visualization</h3>
              <div className="flex items-end justify-center gap-2 mb-6 h-48">
                {currentStepData?.array.map((value, index) => {
                  const isComparing = currentStepData?.comparing.includes(index);
                  const isSorted = currentStepData?.sortedElements.includes(value) && 
                                 index >= currentStepData.array.length - currentStepData.sortedElements.length;
                  const height = (value / Math.max(...currentStepData?.array || [1])) * 120;
                  
                  return (
                    <div
                      key={index}
                      className={`relative transition-all duration-500 ease-in-out ${
                        isComparing 
                          ? 'bg-gradient-to-t from-yellow-400 to-yellow-600 shadow-lg scale-110' 
                          : isSorted 
                            ? 'bg-gradient-to-t from-green-400 to-green-600' 
                            : 'bg-gradient-to-t from-blue-400 to-blue-600'
                      } rounded-t-lg border-2 border-white/20 flex items-end justify-center`}
                      style={{ 
                        width: '40px', 
                        height: `${height}px`,
                        minHeight: '20px'
                      }}
                    >
                      <span className="text-white font-bold text-sm mb-1">{value}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Unsorted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Sorted</span>
                </div>
              </div>
            </div>

            {/* Step Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">📈 Step Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Current Pass</div>
                  <div className="text-2xl font-bold text-blue-400">{currentStepData?.pass || 0}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Step</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {currentStep + 1} / {sortSteps.length}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Swapped</div>
                  <div className="text-lg font-semibold text-red-400">
                    {currentStepData?.swapped ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Sorted Elements</div>
                  <div className="text-lg font-semibold text-green-400">
                    {currentStepData?.sortedElements.length || 0}
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
                  disabled={currentStep === sortSteps.length - 1}
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
                    style={{ width: `${((currentStep + 1) / sortSteps.length) * 100}%` }}
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
`function bubbleSortOptimized(arr) {
  let n = arr.length;
  let swapped;
  
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}` :
`function bubbleSort(arr) {
  let n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`}
                </pre>
              </div>
            </div>

            {/* Algorithm Explanation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">
                {showOptimized ? '⚡ Optimized Bubble Sort' : '🔥 Basic Bubble Sort'}
              </h3>
              
              <div className="space-y-4">
                {showOptimized ? (
                  <div className="space-y-4">
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <h4 className="font-bold text-green-400 mb-2">✅ Optimization Benefits:</h4>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Stops early if no swaps occur in a pass</li>
                        <li>• Best case: O(n) for already sorted arrays</li>
                        <li>• Reduces unnecessary iterations</li>
                        <li>• More efficient for partially sorted arrays</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-blue-400 mb-2">🎯 How optimization works:</h4>
                      <p className="text-gray-300 text-sm">
                        We track if any swaps occurred during a pass. If no swaps happen, 
                        the array is already sorted and we can exit early.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                      <h4 className="font-bold text-blue-400 mb-2">🔍 How it works:</h4>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Compare adjacent elements in pairs</li>
                        <li>• Swap if they are in wrong order</li>
                        <li>• After each pass, largest element is in place</li>
                        <li>• Continue until array is sorted</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-yellow-400 mb-2">📊 Process:</h4>
                      <p className="text-gray-300 text-sm">
                        Each pass through the array "bubbles up" the largest unsorted element 
                        to its correct position at the end.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-pink-400">⏱️ Time & Space Complexity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Worst Case</h4>
                  <div className="text-2xl font-bold text-red-400">O(n²)</div>
                  <div className="text-sm text-gray-400 mt-1">Reverse sorted array</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">Average Case</h4>
                  <div className="text-2xl font-bold text-yellow-400">O(n²)</div>
                  <div className="text-sm text-gray-400 mt-1">Random array</div>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Best Case</h4>
                  <div className="text-2xl font-bold text-green-400">
                    {showOptimized ? 'O(n)' : 'O(n²)'}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {showOptimized ? 'Already sorted' : 'Already sorted'}
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Space Complexity</h4>
                  <div className="text-2xl font-bold text-blue-400">O(1)</div>
                  <div className="text-sm text-gray-400 mt-1">In-place sorting</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-indigo-400">📝 Step-by-Step Walkthrough</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortSteps.map((step, index) => (
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
                <div className="text-lg font-bold text-white mb-2">
                  {step.array.join(', ')}
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  Pass: {step.pass}
                </div>
                <div className="text-xs text-gray-400">
                  {step.description}
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Common Interview Questions</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explain how Bubble Sort works step by step</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Why is Bubble Sort inefficient for large datasets?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>How can you optimize Bubble Sort?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Compare Bubble Sort with Merge Sort/Quick Sort</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When would you use Bubble Sort?</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not understanding the "bubble up" concept</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Forgetting to optimize with swap flag</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not being able to trace the algorithm</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Confusing with other sorting algorithms</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering edge cases</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Sorting Algorithms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/selection-sort"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Selection Sort</h3>
              </div>
              <p className="text-gray-300">Learn in-place sorting with minimum swaps.</p>
            </Link>
            <Link 
              href="/insertion-sort"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Insertion Sort</h3>
              </div>
              <p className="text-gray-300">Master adaptive sorting for nearly sorted data.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
