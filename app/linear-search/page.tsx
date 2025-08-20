'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Search, Database, ArrowRight, ArrowLeft as ArrowLeftIcon, Users, Timer } from 'lucide-react';

interface SearchStep {
  index: number;
  value: number;
  isMatch: boolean;
  isCurrent: boolean;
  isChecked: boolean;
}

export default function LinearSearchPage() {
  const [array, setArray] = useState([10, 25, 30, 42, 55, 67, 78, 89, 91, 100]);
  const [target, setTarget] = useState(42);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [arraySize, setArraySize] = useState(10);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array when size changes
  useEffect(() => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    resetSearch();
  }, [arraySize]);

  // Initialize search steps
  useEffect(() => {
    const steps = array.map((value, index) => ({
      index,
      value,
      isMatch: false,
      isCurrent: false,
      isChecked: false
    }));
    setSearchSteps(steps);
  }, [array]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isComplete) {
      playIntervalRef.current = setInterval(() => {
        performNextStep();
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
  }, [isPlaying, isComplete, currentIndex, array, target]);

  const performNextStep = () => {
    if (currentIndex >= array.length) {
      setIsComplete(true);
      setIsPlaying(false);
      return;
    }

    const newSteps = [...searchSteps];
    newSteps[currentIndex].isChecked = true;
    newSteps[currentIndex].isCurrent = true;

    if (array[currentIndex] === target) {
      newSteps[currentIndex].isMatch = true;
      setFoundIndex(currentIndex);
      setIsComplete(true);
      setIsPlaying(false);
    } else {
      newSteps[currentIndex].isCurrent = false;
      setCurrentIndex(prev => prev + 1);
    }

    setSearchSteps(newSteps);
  };

  const resetSearch = () => {
    setCurrentIndex(0);
    setFoundIndex(-1);
    setIsComplete(false);
    setIsPlaying(false);
    const steps = array.map((value, index) => ({
      index,
      value,
      isMatch: false,
      isCurrent: false,
      isChecked: false
    }));
    setSearchSteps(steps);
  };

  const nextStep = () => {
    if (!isComplete) {
      performNextStep();
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const newSteps = [...searchSteps];
      newSteps[currentIndex - 1].isChecked = false;
      newSteps[currentIndex - 1].isCurrent = false;
      newSteps[currentIndex - 1].isMatch = false;
      setSearchSteps(newSteps);
      setFoundIndex(-1);
      setIsComplete(false);
    }
  };

  const togglePlay = () => {
    if (isComplete) {
      resetSearch();
    }
    setIsPlaying(!isPlaying);
  };

  const getStepDescription = () => {
    if (currentIndex >= array.length) {
      return `Element ${target} not found in the array`;
    }
    if (foundIndex !== -1) {
      return `Found ${target} at index ${foundIndex}!`;
    }
    return `Checking element at index ${currentIndex}: ${array[currentIndex]}`;
  };

  const getTimeComplexity = () => {
    if (foundIndex !== -1) {
      return foundIndex + 1; // +1 because we found it
    }
    return array.length; // Worst case: checked all elements
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
                🔍 Linear Search Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-blue-400">🎯 What is Linear Search?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Definition
                </h3>
                <p className="text-gray-300 mb-4 text-lg">
                  <strong>Linear Search</strong> = "Go through each element one by one until the target is found or array ends."
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Point:</strong> Simple but not always the most efficient approach.
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  When to Use
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Works on unsorted data</li>
                  <li>• Simple to implement</li>
                  <li>• Small datasets</li>
                  <li>• Quick brute-force solution</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4">👥 Visual Analogy: Finding a Friend</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span className="text-sm">Imagine searching for a friend in a row of chairs</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Check each chair one at a time from left to right</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">When found: Stop and return the position</span>
                </div>
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm">If not found: Checked all chairs, return "not found"</span>
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
                min="5"
                max="15"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Value: {target}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            
            <div className="flex items-center justify-center">
              <button
                onClick={resetSearch}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={prevStep}
              disabled={currentIndex === 0}
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
                <pre className="text-gray-300">{`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}

// Usage
const result = linearSearch([${array.join(', ')}], ${target});
console.log(result); // ${foundIndex !== -1 ? foundIndex : -1}`}</pre>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📊 Complexity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">Time Complexity</h4>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">O(n)</div>
                  <p className="text-sm text-gray-300">Worst case: check every element</p>
                  <p className="text-sm text-gray-300">Current operations: {getTimeComplexity()}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Space Complexity</h4>
                  <div className="text-2xl font-bold text-green-400 mb-2">O(1)</div>
                  <p className="text-sm text-gray-300">Only uses a few variables</p>
                  <p className="text-sm text-gray-300">Constant extra space</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">📈 Current Status</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Current Step</div>
                  <div className="text-lg font-bold text-white">{getStepDescription()}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + (foundIndex !== -1 ? 1 : 0)) / array.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {currentIndex + (foundIndex !== -1 ? 1 : 0)} / {array.length} elements checked
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
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        step.isMatch
                          ? 'bg-green-500 border-green-400 text-white'
                          : step.isCurrent
                          ? 'bg-yellow-500 border-yellow-400 text-white animate-pulse'
                          : step.isChecked
                          ? 'bg-red-500 border-red-400 text-white'
                          : 'bg-gray-600 border-gray-500 text-gray-300'
                      }`}
                    >
                      {step.value}
                      {step.isCurrent && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <ArrowRight className="w-6 h-6 text-yellow-400" />
                        </div>
                      )}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                        {index}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Search Result */}
                <div className="mt-6 text-center">
                  {foundIndex !== -1 ? (
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <div className="text-green-400 font-bold text-lg">
                        ✅ Found {target} at index {foundIndex}!
                      </div>
                      <div className="text-gray-300 text-sm">
                        Searched {foundIndex + 1} elements
                      </div>
                    </div>
                  ) : isComplete ? (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                      <div className="text-red-400 font-bold text-lg">
                        ❌ Element {target} not found
                      </div>
                      <div className="text-gray-300 text-sm">
                        Searched all {array.length} elements
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                      <div className="text-blue-400 font-bold text-lg">
                        🔍 Searching for {target}...
                      </div>
                      <div className="text-gray-300 text-sm">
                        Checked {currentIndex} elements so far
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step Walkthrough */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📝 Step-by-Step Walkthrough</h3>
              <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {searchSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        step.isMatch
                          ? 'bg-green-900/20 border border-green-700'
                          : step.isChecked
                          ? 'bg-red-900/20 border border-red-700'
                          : step.isCurrent
                          ? 'bg-yellow-900/20 border border-yellow-700'
                          : 'bg-gray-800'
                      }`}
                    >
                      <span className="font-mono">Step {index + 1}:</span>
                      {step.isMatch ? (
                        <span className="text-green-400 ml-2">
                          Check {step.value} → ✅ Match! Found at index {index}
                        </span>
                      ) : step.isChecked ? (
                        <span className="text-red-400 ml-2">
                          Check {step.value} → ❌ No match
                        </span>
                      ) : step.isCurrent ? (
                        <span className="text-yellow-400 ml-2">
                          Checking {step.value}...
                        </span>
                      ) : (
                        <span className="text-gray-400 ml-2">
                          Check {step.value}
                        </span>
                      )}
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 When to Use Linear Search</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Searching unsorted arrays</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Checking membership in small datasets</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Quick brute-force before optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When simplicity is more important than speed</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>As a baseline for comparing other algorithms</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ When NOT to Use</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Large sorted datasets (use Binary Search)</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Frequent searches on same data</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Performance-critical applications</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>When O(log n) alternatives exist</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Real-time search requirements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison with Binary Search */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">⚖️ Linear Search vs Binary Search</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Aspect</th>
                  <th className="text-left p-3 text-gray-300">Linear Search</th>
                  <th className="text-left p-3 text-gray-300">Binary Search</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-blue-400 font-bold">Time Complexity</td>
                  <td className="p-3 text-white">O(n)</td>
                  <td className="p-3 text-white">O(log n)</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-green-400 font-bold">Space Complexity</td>
                  <td className="p-3 text-white">O(1)</td>
                  <td className="p-3 text-white">O(1) iterative, O(log n) recursive</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-yellow-400 font-bold">Data Requirement</td>
                  <td className="p-3 text-white">Works on any data</td>
                  <td className="p-3 text-white">Requires sorted data</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 text-purple-400 font-bold">Implementation</td>
                  <td className="p-3 text-white">Simple</td>
                  <td className="p-3 text-white">More complex</td>
                </tr>
                <tr>
                  <td className="p-3 text-orange-400 font-bold">Best Use Case</td>
                  <td className="p-3 text-white">Small unsorted datasets</td>
                  <td className="p-3 text-white">Large sorted datasets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Optimization Question */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">💡 Optimization Question</h2>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
            <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Interview Question
            </h3>
            <p className="text-gray-300 mb-4 text-lg">
              <strong>"How can you reduce search time if data is sorted?"</strong>
            </p>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-2">Answer: Binary Search</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Time complexity improves from O(n) to O(log n)</li>
                <li>• Divide and conquer approach</li>
                <li>• Eliminates half the remaining elements each step</li>
                <li>• Much more efficient for large datasets</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-green-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Search Algorithms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/binary-search"
              className="bg-green-600 hover:bg-green-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6" />
                <h3 className="text-xl font-bold">Binary Search</h3>
              </div>
              <p className="text-gray-300">Learn the efficient O(log n) search algorithm for sorted data.</p>
            </Link>
            <Link 
              href="/bubble-sort"
              className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Bubble Sort</h3>
              </div>
              <p className="text-gray-300">Master simple sorting algorithms and their implementations.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
