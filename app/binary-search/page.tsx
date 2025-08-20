'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Search, Database, ArrowRight, BookOpen, Divide, GitBranch } from 'lucide-react';

interface SearchStep {
  index: number;
  value: number;
  isMatch: boolean;
  isCurrent: boolean;
  isChecked: boolean;
  isInRange: boolean;
}

interface PointerState {
  left: number;
  right: number;
  mid: number;
  action: string;
}

export default function BinarySearchPage() {
  const [array, setArray] = useState([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const [target, setTarget] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [arraySize, setArraySize] = useState(10);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [pointerState, setPointerState] = useState<PointerState>({ left: 0, right: 9, mid: 4, action: 'Start' });
  const [searchHistory, setSearchHistory] = useState<PointerState[]>([]);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sorted array when size changes
  useEffect(() => {
    const newArray = Array.from({ length: arraySize }, (_, i) => (i + 1) * 10);
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
      isChecked: false,
      isInRange: true
    }));
    setSearchSteps(steps);
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
  }, [isPlaying, isComplete, pointerState, array, target]);

  const performNextStep = () => {
    const { left, right } = pointerState;
    
    if (left > right) {
      setIsComplete(true);
      setIsPlaying(false);
      return;
    }

    const mid = Math.floor((left + right) / 2);
    const midValue = array[mid];
    let newAction = '';
    let newLeft = left;
    let newRight = right;

    // Update search steps
    const newSteps = [...searchSteps];
    newSteps[mid].isCurrent = true;
    newSteps[mid].isChecked = true;

    if (midValue === target) {
      newSteps[mid].isMatch = true;
      setFoundIndex(mid);
      setIsComplete(true);
      setIsPlaying(false);
      newAction = `Found ${target} at index ${mid}!`;
    } else if (midValue < target) {
      newLeft = mid + 1;
      newAction = `${target} > ${midValue}, move left pointer to ${newLeft}`;
    } else {
      newRight = mid - 1;
      newAction = `${target} < ${midValue}, move right pointer to ${newRight}`;
    }

    // Update range visibility
    newSteps.forEach((step, index) => {
      step.isInRange = index >= newLeft && index <= newRight;
    });

    setSearchSteps(newSteps);

    const newPointerState = { left: newLeft, right: newRight, mid, action: newAction };
    setPointerState(newPointerState);
    setSearchHistory(prev => [...prev, newPointerState]);
    setCurrentStep(prev => prev + 1);
  };

  const resetSearch = () => {
    setCurrentStep(0);
    setFoundIndex(-1);
    setIsComplete(false);
    setIsPlaying(false);
    const initialLeft = 0;
    const initialRight = array.length - 1;
    const initialMid = Math.floor((initialLeft + initialRight) / 2);
    setPointerState({ left: initialLeft, right: initialRight, mid: initialMid, action: 'Start' });
    setSearchHistory([]);
    const steps = array.map((value, index) => ({
      index,
      value,
      isMatch: false,
      isCurrent: false,
      isChecked: false,
      isInRange: true
    }));
    setSearchSteps(steps);
  };

  const nextStep = () => {
    if (!isComplete) {
      performNextStep();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevState = searchHistory[currentStep - 2] || { left: 0, right: array.length - 1, mid: Math.floor((array.length - 1) / 2), action: 'Start' };
      setPointerState(prevState);
      setSearchHistory(prev => prev.slice(0, -1));
      setFoundIndex(-1);
      setIsComplete(false);
      
      // Reset search steps to previous state
      const newSteps = [...searchSteps];
      newSteps.forEach((step, index) => {
        step.isCurrent = false;
        step.isChecked = false;
        step.isMatch = false;
        step.isInRange = index >= prevState.left && index <= prevState.right;
      });
      setSearchSteps(newSteps);
    }
  };

  const togglePlay = () => {
    if (isComplete) {
      resetSearch();
    }
    setIsPlaying(!isPlaying);
  };

  const getStepDescription = () => {
    if (isComplete && foundIndex === -1) {
      return `Element ${target} not found in the array`;
    }
    if (foundIndex !== -1) {
      return `Found ${target} at index ${foundIndex}!`;
    }
    return pointerState.action;
  };

  const getTimeComplexity = () => {
    return Math.ceil(Math.log2(array.length));
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                🔍 Binary Search Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-green-400">🎯 What is Binary Search?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Definition
                </h3>
                <p className="text-gray-300 mb-4 text-lg">
                  <strong>Binary Search</strong> = "Efficient search in a sorted array by repeatedly dividing the search range in half."
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Point:</strong> Only works on sorted arrays, but much faster than linear search.
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Requirements
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Array must be sorted</li>
                  <li>• Works on any sorted data type</li>
                  <li>• Divide and conquer approach</li>
                  <li>• Logarithmic time complexity</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-green-400 mb-4">📚 Visual Analogy: Dictionary Search</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <span className="text-sm">Imagine finding a word in a dictionary</span>
                </div>
                <div className="flex items-center gap-3">
                  <Divide className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Open to the middle page</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-green-400" />
                  <span className="text-sm">If word comes after → go right half</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowLeft className="w-5 h-5 text-red-400" />
                  <span className="text-sm">If word comes before → go left half</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Repeat until found or not possible</span>
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
                min="10"
                max={arraySize * 10}
                step="10"
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
              disabled={currentStep === 0}
              className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
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
                <pre className="text-gray-300">{`// Iterative Binary Search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid; // Found
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // Not found
}

// Recursive Binary Search
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  let mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) 
    return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Usage
const result = binarySearch([${array.join(', ')}], ${target});
console.log(result); // ${foundIndex !== -1 ? foundIndex : -1}`}</pre>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📊 Complexity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Time Complexity</h4>
                  <div className="text-2xl font-bold text-green-400 mb-2">O(log n)</div>
                  <p className="text-sm text-gray-300">Divide by 2 each step</p>
                  <p className="text-sm text-gray-300">Max steps: {getTimeComplexity()}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Space Complexity</h4>
                  <div className="text-2xl font-bold text-blue-400 mb-2">O(1)</div>
                  <p className="text-sm text-gray-300">Iterative: constant space</p>
                  <p className="text-sm text-gray-300">Recursive: O(log n) stack</p>
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400">Left</div>
                    <div className="text-xl font-bold text-blue-400">{pointerState.left}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400">Mid</div>
                    <div className="text-xl font-bold text-yellow-400">{pointerState.mid}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400">Right</div>
                    <div className="text-xl font-bold text-red-400">{pointerState.right}</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / getTimeComplexity()) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Step {currentStep} / ~{getTimeComplexity()}
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
                  {searchSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        step.isMatch
                          ? 'bg-green-500 border-green-400 text-white'
                          : step.isCurrent
                          ? 'bg-yellow-500 border-yellow-400 text-white animate-pulse'
                          : step.isChecked
                          ? 'bg-gray-500 border-gray-400 text-white'
                          : step.isInRange
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-500'
                      }`}
                    >
                      {step.value}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                        {index}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pointer Indicators */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-400">Left Pointer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-400">Mid Pointer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-400">Right Pointer</span>
                  </div>
                </div>
                
                {/* Search Result */}
                <div className="text-center">
                  {foundIndex !== -1 ? (
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <div className="text-green-400 font-bold text-lg">
                        ✅ Found {target} at index {foundIndex}!
                      </div>
                      <div className="text-gray-300 text-sm">
                        Searched in {currentStep} steps
                      </div>
                    </div>
                  ) : isComplete ? (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                      <div className="text-red-400 font-bold text-lg">
                        ❌ Element {target} not found
                      </div>
                      <div className="text-gray-300 text-sm">
                        Searched in {currentStep} steps
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                      <div className="text-blue-400 font-bold text-lg">
                        🔍 Searching for {target}...
                      </div>
                      <div className="text-gray-300 text-sm">
                        Current step: {currentStep}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search History */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">📝 Search History</h3>
              <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {searchHistory.map((step, index) => (
                    <div
                      key={index}
                      className="p-2 rounded text-sm bg-gray-800 border border-gray-600"
                    >
                      <span className="font-mono">Step {index + 1}:</span>
                      <span className="text-gray-300 ml-2">
                        L={step.left}, R={step.right}, M={step.mid} → {step.action}
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 When to Use Binary Search</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Searching sorted arrays</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Finding peak elements</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Square root approximation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>First/last occurrence problems</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Searching rotated arrays</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Using on unsorted arrays</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Incorrect mid calculation</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Off-by-one errors in bounds</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not handling edge cases</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Infinite loops with wrong conditions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison with Linear Search */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">⚖️ Binary Search vs Linear Search</h2>
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

        {/* Trick Questions */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">💡 Interview Trick Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                "What happens if array is not sorted?"
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-red-400 mb-2">Answer: Incorrect Results</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Binary search assumes sorted order</li>
                  <li>• May miss the target even if it exists</li>
                  <li>• Can return wrong index or -1 incorrectly</li>
                  <li>• Always verify array is sorted first</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
              <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                "Why prefer iterative over recursive?"
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">Answer: Saves Stack Space</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Iterative: O(1) space complexity</li>
                  <li>• Recursive: O(log n) stack space</li>
                  <li>• Avoids stack overflow for large arrays</li>
                  <li>• Better performance in practice</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master Sorting Algorithms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/bubble-sort"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Bubble Sort</h3>
              </div>
              <p className="text-gray-300">Learn simple sorting algorithms and their implementations.</p>
            </Link>
            <Link 
              href="/selection-sort"
              className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Selection Sort</h3>
              </div>
              <p className="text-gray-300">Master in-place sorting techniques and optimization.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
