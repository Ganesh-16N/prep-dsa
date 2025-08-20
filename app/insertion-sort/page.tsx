'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, ArrowUpDown, ArrowRight, Search } from 'lucide-react';

interface SortStep {
  array: number[];
  key: number;
  keyIndex: number;
  comparingIndex: number;
  sortedEnd: number;
  step: number;
  description: string;
  action: 'select' | 'compare' | 'shift' | 'insert';
}

export default function InsertionSortPage() {
  const [array, setArray] = useState<number[]>([8, 3, 5, 2, 6]);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [arraySize, setArraySize] = useState<number>(5);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate insertion sort steps
  const generateSortSteps = (inputArray: number[]) => {
    const steps: SortStep[] = [];
    const arr = [...inputArray];
    let stepCount = 0;
    
    // Add initial state
    steps.push({
      array: [...arr],
      key: arr[0],
      keyIndex: 0,
      comparingIndex: -1,
      sortedEnd: 0,
      step: stepCount++,
      description: 'Initial array. First element is considered sorted.',
      action: 'select'
    });

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      
      // Add key selection step
      steps.push({
        array: [...arr],
        key: key,
        keyIndex: i,
        comparingIndex: j,
        sortedEnd: i - 1,
        step: stepCount++,
        description: `Select key element: ${key} at position ${i}`,
        action: 'select'
      });

      // Compare and shift elements
      while (j >= 0 && arr[j] > key) {
        // Add comparison step
        steps.push({
          array: [...arr],
          key: key,
          keyIndex: i,
          comparingIndex: j,
          sortedEnd: i - 1,
          step: stepCount++,
          description: `Compare ${key} with ${arr[j]}. ${arr[j]} > ${key}, so shift ${arr[j]} right.`,
          action: 'compare'
        });

        // Shift element right
        arr[j + 1] = arr[j];
        j--;
        
        // Add shift step
        steps.push({
          array: [...arr],
          key: key,
          keyIndex: j + 2,
          comparingIndex: j,
          sortedEnd: i - 1,
          step: stepCount++,
          description: `Shifted ${arr[j + 2]} to position ${j + 2}`,
          action: 'shift'
        });
      }

      // Insert key in correct position
      arr[j + 1] = key;
      
      // Add insertion step
      steps.push({
        array: [...arr],
        key: key,
        keyIndex: j + 1,
        comparingIndex: -1,
        sortedEnd: i,
        step: stepCount++,
        description: `Inserted ${key} at position ${j + 1}. Sorted portion now includes first ${i + 1} elements.`,
        action: 'insert'
      });
    }
    
    // Add final sorted state
    steps.push({
      array: [...arr],
      key: -1,
      keyIndex: -1,
      comparingIndex: -1,
      sortedEnd: arr.length - 1,
      step: stepCount++,
      description: 'Array is now completely sorted!',
      action: 'insert'
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
                🃏 Insertion Sort Mastery
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
                  What is Insertion Sort?
                </h3>
                <p className="text-gray-300 mb-4">
                  Insertion Sort is a simple sorting algorithm that builds the final sorted array 
                  one item at a time by comparing and inserting elements into their correct position.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Analogy:</strong> Like arranging playing cards in your hand one by one into the right order.
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  When to Use Insertion Sort
                </h3>
                <p className="text-gray-300 mb-4">
                  Insertion Sort is most efficient for small datasets, nearly sorted data, 
                  and is often used in educational contexts and interviews.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Key Advantage:</strong> Simple to understand and implement, efficient for small arrays.
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-yellow-400 mb-4">📊 Step-by-Step Process</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-400">Step 1</h4>
                  <p className="text-sm text-gray-300">First element is considered sorted. Start with second element as key.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-400">Step 2</h4>
                  <p className="text-sm text-gray-300">Compare key with elements in sorted portion, shift larger elements right.</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-purple-400">Step 3</h4>
                  <p className="text-sm text-gray-300">Insert key in correct position within sorted portion.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-400">Step 4</h4>
                  <p className="text-sm text-gray-300">Repeat for all remaining elements until array is sorted.</p>
                </div>
              </div>
            </div>
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
                placeholder="8, 3, 5, 2, 6"
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
                  const isKey = index === currentStepData?.keyIndex;
                  const isComparing = index === currentStepData?.comparingIndex;
                  const isSorted = index <= currentStepData?.sortedEnd;
                  const height = (value / Math.max(...currentStepData?.array || [1])) * 120;
                  
                  let bgClass = 'bg-gradient-to-t from-blue-400 to-blue-600';
                  if (isKey) {
                    bgClass = 'bg-gradient-to-t from-yellow-400 to-yellow-600 shadow-lg scale-110';
                  } else if (isComparing) {
                    bgClass = 'bg-gradient-to-t from-red-400 to-red-600 shadow-lg';
                  } else if (isSorted) {
                    bgClass = 'bg-gradient-to-t from-green-400 to-green-600';
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`relative transition-all duration-500 ease-in-out ${bgClass} rounded-t-lg border-2 border-white/20 flex items-end justify-center`}
                      style={{ 
                        width: '40px', 
                        height: `${height}px`,
                        minHeight: '20px'
                      }}
                    >
                      <span className="text-white font-bold text-sm mb-1">{value}</span>
                      {isKey && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">
                          KEY
                        </div>
                      )}
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
                  <span>Key Element</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
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
                  <div className="text-sm text-gray-400">Current Action</div>
                  <div className="text-lg font-bold text-blue-400 capitalize">
                    {currentStepData?.action || 'Initial'}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Step</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {currentStep + 1} / {sortSteps.length}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Key Element</div>
                  <div className="text-lg font-semibold text-yellow-400">
                    {currentStepData?.key !== -1 ? currentStepData?.key : 'None'}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Sorted Elements</div>
                  <div className="text-lg font-semibold text-green-400">
                    {currentStepData?.sortedEnd + 1 || 0}
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
{`function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];        // Current element to insert
    let j = i - 1;           // Start comparing with previous element
    
    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];   // Shift element right
      j--;                   // Move to previous element
    }
    
    arr[j + 1] = key;        // Insert key in correct position
  }
  
  return arr;
}`}
                </pre>
              </div>
            </div>

            {/* Algorithm Explanation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-orange-400">🔍 How Insertion Sort Works</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">🎯 Key Concept:</h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Build sorted array one element at a time</li>
                    <li>• Each iteration takes an element and places it in correct position</li>
                    <li>• Compare with already sorted portion</li>
                    <li>• Shift elements to make space for insertion</li>
                  </ul>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">📊 Process:</h4>
                  <p className="text-gray-300 text-sm">
                    Start with second element as key. Compare it with elements in the sorted portion 
                    (left side). Shift larger elements right until finding the correct position for the key.
                  </p>
                </div>

                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">✅ Advantages:</h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Simple to understand and implement</li>
                    <li>• Efficient for small datasets</li>
                    <li>• Works well with nearly sorted data</li>
                    <li>• In-place sorting (O(1) space complexity)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-pink-400">⏱️ Time & Space Complexity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Best Case</h4>
                  <div className="text-2xl font-bold text-green-400">O(n)</div>
                  <div className="text-sm text-gray-400 mt-1">Already sorted array</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">Average Case</h4>
                  <div className="text-2xl font-bold text-yellow-400">O(n²)</div>
                  <div className="text-sm text-gray-400 mt-1">Random array</div>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Worst Case</h4>
                  <div className="text-2xl font-bold text-red-400">O(n²)</div>
                  <div className="text-sm text-gray-400 mt-1">Reverse sorted array</div>
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
                <div className="text-sm text-gray-300 mb-1 capitalize">
                  {step.action}
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
                  <span>Explain how Insertion Sort works step by step</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Why is Insertion Sort efficient for small datasets?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Compare Insertion Sort with Bubble Sort</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When would you choose Insertion Sort over other algorithms?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>How does Insertion Sort handle nearly sorted data?</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not understanding the "insertion" concept</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Confusing with Selection Sort</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not being able to trace the algorithm</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Forgetting about the sorted portion</span>
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
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master Problem Solving Patterns?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/brute-force"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6" />
                <h3 className="text-xl font-bold">Brute Force Approach</h3>
              </div>
              <p className="text-gray-300">Master exhaustive search strategies and problem-solving patterns.</p>
            </Link>
            <Link 
              href="/sliding-window"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Code className="w-6 h-6" />
                <h3 className="text-xl font-bold">Sliding Window</h3>
              </div>
              <p className="text-gray-300">Learn how to optimize subarray problems from O(n²) to O(n).</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
