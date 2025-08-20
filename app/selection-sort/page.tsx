'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Search, Database, ArrowRight, Users, Timer, Minus, ArrowUpDown } from 'lucide-react';

interface SortStep {
  index: number;
  value: number;
  isCurrent: boolean;
  isMin: boolean;
  isSorted: boolean;
  isSwapping: boolean;
}

interface SortAction {
  type: 'find_min' | 'swap' | 'complete';
  currentIndex: number;
  minIndex: number;
  description: string;
}

export default function SelectionSortPage() {
  const [array, setArray] = useState([64, 25, 12, 22, 11]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [arraySize, setArraySize] = useState(5);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [sortHistory, setSortHistory] = useState<SortAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [minIndex, setMinIndex] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array when size changes
  useEffect(() => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    resetSort();
  }, [arraySize]);

  // Initialize sort steps
  useEffect(() => {
    const steps = array.map((value, index) => ({
      index,
      value,
      isCurrent: false,
      isMin: false,
      isSorted: false,
      isSwapping: false
    }));
    setSortSteps(steps);
  }, [array]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isComplete) {
      playIntervalRef.current = setInterval(() => {
        performNextStep();
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
  }, [isPlaying, isComplete, currentIndex, array]);

  const performNextStep = () => {
    if (currentIndex >= array.length - 1) {
      setIsComplete(true);
      setIsPlaying(false);
      return;
    }

    // Find minimum in unsorted portion
    if (!isSwapping) {
      const newMinIndex = findMinInRange(currentIndex);
      setMinIndex(newMinIndex);
      
      // Update sort steps
      const newSteps = [...sortSteps];
      newSteps.forEach((step, index) => {
        step.isCurrent = index === currentIndex;
        step.isMin = index === newMinIndex;
        step.isSorted = index < currentIndex;
      });
      setSortSteps(newSteps);

      // Add to history
      const action: SortAction = {
        type: 'find_min',
        currentIndex,
        minIndex: newMinIndex,
        description: `Found minimum ${array[newMinIndex]} at index ${newMinIndex}`
      };
      setSortHistory(prev => [...prev, action]);
      setIsSwapping(true);
    } else {
      // Perform swap
      if (currentIndex !== minIndex) {
        const newArray = [...array];
        [newArray[currentIndex], newArray[minIndex]] = [newArray[minIndex], newArray[currentIndex]];
        setArray(newArray);

        // Update sort steps for swap animation
        const newSteps = [...sortSteps];
        newSteps[currentIndex].isSwapping = true;
        newSteps[minIndex].isSwapping = true;
        setSortSteps(newSteps);

        // Add swap action to history
        const action: SortAction = {
          type: 'swap',
          currentIndex,
          minIndex,
          description: `Swapped ${array[minIndex]} with ${array[currentIndex]}`
        };
        setSortHistory(prev => [...prev, action]);
      }

      // Move to next iteration
      setCurrentIndex(prev => prev + 1);
      setIsSwapping(false);
    }

    setCurrentStep(prev => prev + 1);
  };

  const findMinInRange = (startIndex: number) => {
    let minIndex = startIndex;
    for (let i = startIndex + 1; i < array.length; i++) {
      if (array[i] < array[minIndex]) {
        minIndex = i;
      }
    }
    return minIndex;
  };

  const resetSort = () => {
    setCurrentStep(0);
    setIsComplete(false);
    setIsPlaying(false);
    setCurrentIndex(0);
    setMinIndex(0);
    setIsSwapping(false);
    setSortHistory([]);
    const steps = array.map((value, index) => ({
      index,
      value,
      isCurrent: false,
      isMin: false,
      isSorted: false,
      isSwapping: false
    }));
    setSortSteps(steps);
  };

  const nextStep = () => {
    if (!isComplete) {
      performNextStep();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      // Reset to previous state (simplified for demo)
      resetSort();
      // Replay steps up to currentStep - 1
      for (let i = 0; i < currentStep - 1; i++) {
        performNextStep();
      }
    }
  };

  const togglePlay = () => {
    if (isComplete) {
      resetSort();
    }
    setIsPlaying(!isPlaying);
  };

  const getStepDescription = () => {
    if (isComplete) {
      return `Sorting complete! Array is now sorted.`;
    }
    if (isSwapping) {
      return `Swapping ${array[minIndex]} with ${array[currentIndex]}`;
    }
    return `Finding minimum in range [${currentIndex}, ${array.length - 1}]`;
  };

  const getTimeComplexity = () => {
    return array.length * (array.length - 1) / 2;
  };

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                🔄 Selection Sort Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-orange-400">🎯 What is Selection Sort?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Definition
                </h3>
                <p className="text-gray-300 mb-4 text-lg">
                  <strong>Selection Sort</strong> = "Repeatedly find the minimum element from the unsorted part and place it at the beginning."
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Point:</strong> Simple but not efficient for large datasets.
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sorting Steps
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Step 1: Find min in whole array → swap with first</li>
                  <li>• Step 2: Find min in remaining array → swap with second</li>
                  <li>• Repeat until sorted</li>
                  <li>• In-place sorting algorithm</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4">👥 Visual Analogy: Lining Up by Height</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span className="text-sm">Imagine lining up people by height</span>
                </div>
                <div className="flex items-center gap-3">
                  <Minus className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Find the shortest person in the remaining group</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Swap them to the front of the line</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Repeat until everyone is sorted</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Simple but not efficient for large groups</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🎮 Interactive Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Array Size: {arraySize}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-center">
              <button
                onClick={resetSort}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
                  setArray(newArray);
                  resetSort();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                New Array
              </button>
            </div>
          </div>

          {/* Playback Controls */}
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
              className="p-3 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={nextStep}
              disabled={isComplete}
              className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Code & Explanation */}
          <div className="space-y-6">
            {/* Code Implementation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Code className="w-5 h-5" />
                JavaScript Implementation
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // swap
  }
  return arr;
}

// Usage
const result = selectionSort([${array.join(', ')}]);
console.log(result); // [${array.slice().sort((a, b) => a - b).join(', ')}]`}</pre>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📊 Complexity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Time Complexity</h4>
                  <div className="text-2xl font-bold text-red-400 mb-2">O(n²)</div>
                  <p className="text-sm text-gray-300">All cases: Best, Average, Worst</p>
                  <p className="text-sm text-gray-300">Comparisons: {getTimeComplexity()}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Space Complexity</h4>
                  <div className="text-2xl font-bold text-green-400 mb-2">O(1)</div>
                  <p className="text-sm text-gray-300">In-place sorting</p>
                  <p className="text-sm text-gray-300">No extra array needed</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">📈 Current Status</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Current Action</div>
                  <div className="text-lg font-bold text-white">{getStepDescription()}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400">Current Index</div>
                    <div className="text-xl font-bold text-blue-400">{currentIndex}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400">Min Index</div>
                    <div className="text-xl font-bold text-yellow-400">{minIndex}</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentIndex / (array.length - 1)) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Iteration {currentIndex + 1} / {array.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Visualization */}
          <div className="space-y-6">
            {/* Array Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">🎯 Array Visualization</h3>
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {sortSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        step.isSwapping
                          ? 'bg-green-500 border-green-400 text-white animate-pulse'
                          : step.isMin
                          ? 'bg-yellow-500 border-yellow-400 text-white'
                          : step.isCurrent
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : step.isSorted
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-gray-600 border-gray-500 text-white'
                      }`}
                    >
                      {step.value}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                        {index}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-400">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-400">Minimum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Swapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-green-400">Sorted</span>
                  </div>
                </div>
                
                {/* Sort Result */}
                <div className="text-center">
                  {isComplete ? (
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <div className="text-green-400 font-bold text-lg">
                        ✅ Sorting Complete!
                      </div>
                      <div className="text-gray-300 text-sm">
                        Array is now sorted in ascending order
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                      <div className="text-blue-400 font-bold text-lg">
                        🔄 Sorting in Progress...
                      </div>
                      <div className="text-gray-300 text-sm">
                        Current iteration: {currentIndex + 1}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sort History */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📝 Sort History</h3>
              <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {sortHistory.map((action, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm border ${
                        action.type === 'swap' 
                          ? 'bg-green-900/20 border-green-700' 
                          : 'bg-blue-900/20 border-blue-700'
                      }`}
                    >
                      <span className="font-mono">Step {index + 1}:</span>
                      <span className="text-gray-300 ml-2">
                        {action.description}
                      </span>
                    </div>
                  ))}
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 When to Use Selection Sort</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Small arrays (n {'<'} 50)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When memory is limited</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When swap operations are expensive</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Educational purposes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When simplicity is preferred</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ When NOT to Use</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>
                    Large datasets (n {'>'} 1000)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Performance-critical applications</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>When data is already partially sorted</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Real-time sorting requirements</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>When O(n log n) alternatives exist</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison with Other Sorts */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">⚖️ Selection Sort vs Other Sorts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Aspect</th>
                  <th className="text-left p-3 text-gray-300">Selection Sort</th>
                  <th className="text-left p-3 text-gray-300">Bubble Sort</th>
                  <th className="text-left p-3 text-gray-300">Insertion Sort</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-blue-400 font-bold">Time Complexity</td>
                  <td className="p-3 text-white">O(n²)</td>
                  <td className="p-3 text-white">O(n²)</td>
                  <td className="p-3 text-white">O(n²)</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-green-400 font-bold">Space Complexity</td>
                  <td className="p-3 text-white">O(1)</td>
                  <td className="p-3 text-white">O(1)</td>
                  <td className="p-3 text-white">O(1)</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-yellow-400 font-bold">Swaps</td>
                  <td className="p-3 text-white">O(n)</td>
                  <td className="p-3 text-white">O(n²)</td>
                  <td className="p-3 text-white">O(n²)</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-purple-400 font-bold">Adaptive</td>
                  <td className="p-3 text-white">No</td>
                  <td className="p-3 text-white">Yes</td>
                  <td className="p-3 text-white">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 text-orange-400 font-bold">Best Use Case</td>
                  <td className="p-3 text-white">Small arrays, minimal swaps</td>
                  <td className="p-3 text-white">Educational, simple</td>
                  <td className="p-3 text-white">Small arrays, nearly sorted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">💡 Key Points to Remember</h2>
          
          <div className="space-y-6">
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6">
              <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Why Selection Sort is Not Efficient
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Always performs O(n²) comparisons regardless of input</li>
                  <li>• Not adaptive - doesn't get faster if array is partially sorted</li>
                  <li>• Poor performance on large datasets</li>
                  <li>• Better algorithms exist (Quick Sort, Merge Sort, etc.)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Advantages of Selection Sort
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Simple to understand and implement</li>
                  <li>• Performs minimum number of swaps (O(n))</li>
                  <li>• In-place sorting - no extra memory needed</li>
                  <li>• Good for small datasets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Sorting Algorithms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/insertion-sort"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Insertion Sort</h3>
              </div>
              <p className="text-gray-300">Learn adaptive sorting for nearly sorted data.</p>
            </Link>
            <Link 
              href="/brute-force"
              className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6" />
                <h3 className="text-xl font-bold">Brute Force Approach</h3>
              </div>
              <p className="text-gray-300">Master exhaustive search strategies and problem-solving patterns.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
