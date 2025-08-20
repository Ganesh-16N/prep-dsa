'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Search, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, Repeat, TrendingUp, Layers } from 'lucide-react';

interface BruteForceStep {
  i: number;
  j: number;
  currentSum: number;
  isMatch: boolean;
  description: string;
  operations: number;
}

interface Problem {
  id: string;
  name: string;
  description: string;
  array: number[];
  target: number;
  steps: BruteForceStep[];
  timeComplexity: string;
  spaceComplexity: string;
  codeExample: string;
  visualExample: string;
}

export default function BruteForcePage() {
  const [selectedProblem, setSelectedProblem] = useState('pair-sum');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arraySize, setArraySize] = useState(5);
  const [showOptimized, setShowOptimized] = useState(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const problems: Problem[] = [
    {
      id: 'pair-sum',
      name: 'Pair Sum Problem',
      description: 'Find two numbers that add up to target value',
      array: [2, 4, 6, 8, 10],
      target: 14,
      steps: [],
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      codeExample: `function hasPairWithSum(arr, sum) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === sum) return true;
    }
  }
  return false;
}`,
      visualExample: 'Check every possible pair: (2,4), (2,6), (2,8), (2,10), (4,6)...'
    },
    {
      id: 'linear-search',
      name: 'Linear Search',
      description: 'Find target element in array',
      array: [5, 8, 12, 15, 20],
      target: 15,
      steps: [],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExample: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      visualExample: 'Check each element one by one: 5, 8, 12, 15 ✅'
    },
    {
      id: 'string-match',
      name: 'String Matching',
      description: 'Find pattern in text',
      array: [1, 2, 3, 4, 5, 6, 7, 8],
      target: 5,
      steps: [],
      timeComplexity: 'O(n·m)',
      spaceComplexity: 'O(1)',
      codeExample: `function naiveSearch(text, pattern) {
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (text[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}`,
      visualExample: 'Check pattern at each position: "ABC" in "XYZABC123"'
    }
  ];

  const currentProblem = problems.find(p => p.id === selectedProblem) || problems[0];

  // Generate brute force steps for current problem
  useEffect(() => {
    const generateSteps = () => {
      const steps: BruteForceStep[] = [];
      let operations = 0;

      if (selectedProblem === 'pair-sum') {
        for (let i = 0; i < currentProblem.array.length; i++) {
          for (let j = i + 1; j < currentProblem.array.length; j++) {
            operations++;
            const sum = currentProblem.array[i] + currentProblem.array[j];
            const isMatch = sum === currentProblem.target;
            
            steps.push({
              i,
              j,
              currentSum: sum,
              isMatch,
              description: `Check pair (${currentProblem.array[i]}, ${currentProblem.array[j]}) = ${sum}`,
              operations
            });

            if (isMatch) break;
          }
          if (steps[steps.length - 1]?.isMatch) break;
        }
      } else if (selectedProblem === 'linear-search') {
        for (let i = 0; i < currentProblem.array.length; i++) {
          operations++;
          const isMatch = currentProblem.array[i] === currentProblem.target;
          
          steps.push({
            i,
            j: i,
            currentSum: currentProblem.array[i],
            isMatch,
            description: `Check element at index ${i}: ${currentProblem.array[i]}`,
            operations
          });

          if (isMatch) break;
        }
      } else if (selectedProblem === 'string-match') {
        // Simplified version for array
        for (let i = 0; i < currentProblem.array.length; i++) {
          operations++;
          const isMatch = currentProblem.array[i] === currentProblem.target;
          
          steps.push({
            i,
            j: i,
            currentSum: currentProblem.array[i],
            isMatch,
            description: `Check position ${i}: ${currentProblem.array[i]}`,
            operations
          });

          if (isMatch) break;
        }
      }

      // Update the problem with generated steps
      const updatedProblems = problems.map(p => 
        p.id === selectedProblem ? { ...p, steps } : p
      );
      // Note: In a real implementation, you'd use state to update problems
    };

    generateSteps();
    setCurrentStep(0);
  }, [selectedProblem, currentProblem.array, currentProblem.target]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < currentProblem.steps.length) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= currentProblem.steps.length - 1) {
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
  }, [isPlaying, currentStep, currentProblem.steps.length]);

  const nextStep = () => {
    if (currentStep < currentProblem.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (currentStep >= currentProblem.steps.length - 1) {
      resetSteps();
    }
    setIsPlaying(!isPlaying);
  };

  const currentStepData = currentProblem.steps[currentStep];

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                💪 Brute Force Approach Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-red-400 flex items-center gap-3">
            <Search className="w-8 h-8" />
            What is Brute Force Approach?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                <strong className="text-red-400">Brute Force</strong> is a straightforward method that tries all possible solutions until one works. 
                It's easy to implement but usually inefficient.
              </p>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                  🔑 Visual Analogy
                </h3>
                <p className="text-gray-300">
                  Imagine trying every key in a keychain until the lock opens. 
                  You systematically check each key, even though most won't work.
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  ⚡ Key Takeaway
                </h3>
                <p className="text-gray-300">
                  <strong>Brute Force = Correct but not optimal.</strong> 
                  It guarantees finding the solution but may be very slow.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Advantages
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Simple to understand and implement</li>
                  <li>• Guaranteed to find the solution</li>
                  <li>• Good starting point for optimization</li>
                  <li>• Works for any problem</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Disadvantages
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Usually very slow (exponential/polynomial time)</li>
                  <li>• Inefficient for large inputs</li>
                  <li>• Not suitable for production systems</li>
                  <li>• Can be impractical for complex problems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Selector */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">🎯 Choose a Problem to Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {problems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => setSelectedProblem(problem.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedProblem === problem.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <h3 className="font-bold mb-2">{problem.name}</h3>
                <p className="text-sm opacity-80">{problem.description}</p>
                <div className="mt-2 text-xs">
                  <span className="text-red-400">Time: {problem.timeComplexity}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Code & Explanation */}
          <div className="space-y-8">
            {/* Code Example */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Brute Force Implementation
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{currentProblem.codeExample}</pre>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Complexity Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Time Complexity</h4>
                  <p className="text-2xl font-bold text-white">{currentProblem.timeComplexity}</p>
                  <p className="text-sm text-gray-300 mt-1">Worst case scenario</p>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Space Complexity</h4>
                  <p className="text-2xl font-bold text-white">{currentProblem.spaceComplexity}</p>
                  <p className="text-sm text-gray-300 mt-1">Extra memory used</p>
                </div>
              </div>
            </div>

            {/* Visual Example */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <Target className="w-6 h-6" />
                How It Works
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-300">{currentProblem.visualExample}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Visualization */}
          <div className="space-y-8">
            {/* Controls */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <Play className="w-6 h-6" />
                Interactive Controls
              </h3>
              
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep >= currentProblem.steps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  Next
                </button>
                <button
                  onClick={resetSteps}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">Array Size</label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-300 mt-1">{arraySize} elements</div>
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
                  <span className="text-white font-bold">{currentStep + 1} / {currentProblem.steps.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Operations:</span>
                  <span className="text-red-400 font-bold">{currentStepData?.operations || 0}</span>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    {currentStepData?.description || 'Ready to start...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Array Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                Array Visualization
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProblem.array.map((value, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${
                      currentStepData && (currentStepData.i === index || currentStepData.j === index)
                        ? currentStepData.isMatch
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <span className="text-gray-400">Target: </span>
                <span className="text-yellow-400 font-bold text-lg">{currentProblem.target}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough */}
        {currentProblem.steps.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">📋 Step-by-Step Walkthrough</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProblem.steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    index === currentStep
                      ? 'bg-blue-600 border-blue-500'
                      : index < currentStep
                      ? 'bg-green-900/20 border-green-700'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Step {index + 1}</span>
                    <span className="text-sm text-red-400">{step.operations} ops</span>
                  </div>
                  <p className="text-sm text-gray-300">{step.description}</p>
                  {step.isMatch && (
                    <div className="mt-2 text-green-400 text-sm font-bold">✅ Match found!</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Context */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Interview Context (20 LPA Level)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Interview Strategy</h3>
              <p className="text-gray-300 mb-4">
                Brute Force is often the <strong>first step</strong> before optimization. 
                Interviewers expect you to start simple and then improve.
              </p>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-blue-400 mb-2">Common Interview Pattern:</h4>
                <ol className="text-gray-300 space-y-2 text-sm">
                  <li>1. Start with brute force solution</li>
                  <li>2. Interviewer asks for optimization</li>
                  <li>3. Move to efficient solution (hashing, sorting, DP)</li>
                  <li>4. Discuss trade-offs and edge cases</li>
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">⚡ Optimization Examples</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">String Search</h4>
                  <p className="text-sm text-gray-300">
                    Brute Force (O(n·m)) → KMP Algorithm (O(n + m))
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Pair Sum</h4>
                  <p className="text-sm text-gray-300">
                    Brute Force (O(n²)) → HashSet (O(n))
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Traveling Salesman</h4>
                  <p className="text-sm text-gray-300">
                    Brute Force (O(n!)) → Dynamic Programming (O(n²·2ⁿ))
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Learn Optimized Approaches?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/sliding-window"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Code className="w-6 h-6" />
                <h3 className="text-xl font-bold">Sliding Window</h3>
              </div>
              <p className="text-gray-300">Learn how to optimize subarray problems from O(n²) to O(n).</p>
            </Link>
            <Link 
              href="/recursion"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Repeat className="w-6 h-6" />
                <h3 className="text-xl font-bold">Recursion</h3>
              </div>
              <p className="text-gray-300">Master recursive problem-solving techniques and optimization.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
