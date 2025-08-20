'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, TrendingUp, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, ArrowUpDown, ArrowRight, Search, Repeat, Layers, GitBranch } from 'lucide-react';

interface IterationStep {
  step: number;
  i: number;
  total: number;
  description: string;
  action: 'start' | 'loop' | 'end';
}

interface RecursionStep {
  step: number;
  n: number;
  callStack: number[];
  result: number;
  description: string;
  action: 'call' | 'return' | 'base';
}

export default function IterationVsRecursionPage() {
  const [inputN, setInputN] = useState<number>(5);
  const [iterationSteps, setIterationSteps] = useState<IterationStep[]>([]);
  const [recursionSteps, setRecursionSteps] = useState<RecursionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showFactorial, setShowFactorial] = useState<boolean>(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate iteration steps
  const generateIterationSteps = (n: number) => {
    const steps: IterationStep[] = [];
    let total = 0;
    
    // Initial step
    steps.push({
      step: 0,
      i: 0,
      total: 0,
      description: 'Initialize: total = 0',
      action: 'start'
    });

    // Loop steps
    for (let i = 1; i <= n; i++) {
      total += i;
      steps.push({
        step: i,
        i: i,
        total: total,
        description: `Loop ${i}: total += ${i} = ${total}`,
        action: 'loop'
      });
    }

    // Final step
    steps.push({
      step: n + 1,
      i: n + 1,
      total: total,
      description: `Result: ${total}`,
      action: 'end'
    });

    return steps;
  };

  // Generate recursion steps
  const generateRecursionSteps = (n: number) => {
    const steps: RecursionStep[] = [];
    let stepCount = 0;
    let callStack: number[] = [];
    let result = 0;

    const simulateRecursion = (num: number, depth: number) => {
      // Add call step
      callStack = [...callStack, num];
      steps.push({
        step: stepCount++,
        n: num,
        callStack: [...callStack],
        result: result,
        description: `Call: sumRecursive(${num})`,
        action: 'call'
      });

      if (num === 0) {
        // Base case
        result = 0;
        steps.push({
          step: stepCount++,
          n: num,
          callStack: [...callStack],
          result: result,
          description: `Base case: sumRecursive(0) = 0`,
          action: 'base'
        });
      } else {
        // Recursive case
        const prevResult = simulateRecursion(num - 1, depth + 1);
        result = num + prevResult;
        
        // Add return step
        callStack.pop();
        steps.push({
          step: stepCount++,
          n: num,
          callStack: [...callStack],
          result: result,
          description: `Return: ${num} + ${prevResult} = ${result}`,
          action: 'return'
        });
      }

      return result;
    };

    simulateRecursion(n, 0);
    return steps;
  };

  // Update steps when input changes
  useEffect(() => {
    const iterSteps = generateIterationSteps(inputN);
    const recurSteps = generateRecursionSteps(inputN);
    setIterationSteps(iterSteps);
    setRecursionSteps(recurSteps);
    setCurrentStep(0);
  }, [inputN]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const maxSteps = Math.max(iterationSteps.length, recursionSteps.length);
          if (prev >= maxSteps - 1) {
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
  }, [isPlaying, iterationSteps.length, recursionSteps.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    const maxSteps = Math.max(iterationSteps.length, recursionSteps.length);
    setCurrentStep(prev => Math.min(prev + 1, maxSteps - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const currentIterationStep = iterationSteps[currentStep];
  const currentRecursionStep = recursionSteps[currentStep];

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
                🔄 Iteration vs Recursion Mastery
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
                  <Repeat className="w-5 h-5" />
                  What is Iteration?
                </h3>
                <p className="text-gray-300 mb-4">
                  Iteration uses looping constructs (for, while) to repeat steps until a condition is met. 
                  It's like climbing stairs step by step.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Pros:</strong> Efficient memory usage (O(1) space), generally faster
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  What is Recursion?
                </h3>
                <p className="text-gray-300 mb-4">
                  Recursion is when a function calls itself until a base condition is satisfied. 
                  It's like mirrors inside mirrors until base case stops it.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Pros:</strong> Elegant code, natural for trees/graphs, divide & conquer
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-yellow-400 mb-4">📊 Comparison Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-2 text-gray-300">Aspect</th>
                      <th className="text-left p-2 text-blue-400">Iteration</th>
                      <th className="text-left p-2 text-purple-400">Recursion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-600">
                      <td className="p-2 text-gray-300">Space Complexity</td>
                      <td className="p-2 text-green-400 font-bold">O(1)</td>
                      <td className="p-2 text-red-400 font-bold">O(n)</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <td className="p-2 text-gray-300">Time Complexity</td>
                      <td className="p-2 text-green-400 font-bold">O(n)</td>
                      <td className="p-2 text-green-400 font-bold">O(n)</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <td className="p-2 text-gray-300">Code Elegance</td>
                      <td className="p-2 text-yellow-400">Simple loops</td>
                      <td className="p-2 text-green-400">Elegant</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-gray-300">Stack Overflow Risk</td>
                      <td className="p-2 text-green-400">No risk</td>
                      <td className="p-2 text-red-400">High risk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Toggle */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setShowFactorial(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                !showFactorial
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔢 Sum of Numbers (1 to n)
            </button>
            <button
              onClick={() => setShowFactorial(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                showFactorial
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🧮 Factorial (n!)
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">🎛️ Interactive Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Input Value (n)
              </label>
              <input
                type="number"
                value={inputN}
                onChange={(e) => setInputN(Math.max(1, Math.min(10, parseInt(e.target.value) || 5)))}
                min="1"
                max="10"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
            <div className="flex items-end">
              <button
                onClick={togglePlay}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Iteration */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <Repeat className="w-5 h-5" />
                Iteration Approach
              </h3>
              
              {/* Iteration Visualization */}
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {Array.from({ length: inputN }, (_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 ${
                        currentIterationStep?.i > i
                          ? 'bg-green-500 border-green-400'
                          : currentIterationStep?.i === i + 1
                          ? 'bg-yellow-500 border-yellow-400 scale-110'
                          : 'bg-gray-600 border-gray-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-400">Current Step</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {currentIterationStep?.i || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total</div>
                  <div className="text-xl font-bold text-green-400">
                    {currentIterationStep?.total || 0}
                  </div>
                </div>
              </div>

              {/* Iteration Code */}
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
{showFactorial ? 
`function factorialIterative(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}` :
`function sumIterative(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}`}
                </pre>
              </div>
            </div>

            {/* Iteration Complexity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400">⏱️ Iteration Complexity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Time Complexity</h4>
                  <div className="text-2xl font-bold text-green-400">O(n)</div>
                  <div className="text-sm text-gray-400 mt-1">Linear time</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Space Complexity</h4>
                  <div className="text-2xl font-bold text-blue-400">O(1)</div>
                  <div className="text-sm text-gray-400 mt-1">Constant space</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recursion */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Recursion Approach
              </h3>
              
              {/* Recursion Visualization - Call Stack */}
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400">Call Stack</div>
                  <div className="h-32 bg-gray-800 rounded-lg p-2 flex flex-col-reverse justify-start">
                    {currentRecursionStep?.callStack.map((call, index) => (
                      <div
                        key={index}
                        className={`w-full p-2 mb-1 rounded text-center font-mono text-sm transition-all duration-500 ${
                          index === currentRecursionStep.callStack.length - 1
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        sumRecursive({call})
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-400">Current n</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {currentRecursionStep?.n || 0}
                  </div>
                  <div className="text-sm text-gray-400">Result</div>
                  <div className="text-xl font-bold text-green-400">
                    {currentRecursionStep?.result || 0}
                  </div>
                </div>
              </div>

              {/* Recursion Code */}
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
{showFactorial ? 
`function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}` :
`function sumRecursive(n) {
  if (n === 0) return 0;
  return n + sumRecursive(n - 1);
}`}
                </pre>
              </div>
            </div>

            {/* Recursion Complexity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-red-400">⏱️ Recursion Complexity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Time Complexity</h4>
                  <div className="text-2xl font-bold text-green-400">O(n)</div>
                  <div className="text-sm text-gray-400 mt-1">Linear time</div>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Space Complexity</h4>
                  <div className="text-2xl font-bold text-red-400">O(n)</div>
                  <div className="text-sm text-gray-400 mt-1">Stack space</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-indigo-400">📝 Step-by-Step Walkthrough</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Iteration Steps */}
            <div>
              <h4 className="font-bold text-blue-400 mb-4">🔄 Iteration Steps</h4>
              <div className="space-y-2">
                {iterationSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      index === currentStep
                        ? 'bg-blue-900/20 border-blue-500 shadow-lg'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="text-sm text-gray-400">Step {step.step}</div>
                    <div className="text-lg font-bold text-white">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recursion Steps */}
            <div>
              <h4 className="font-bold text-purple-400 mb-4">🔄 Recursion Steps</h4>
              <div className="space-y-2">
                {recursionSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      index === currentStep
                        ? 'bg-purple-900/20 border-purple-500 shadow-lg'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="text-sm text-gray-400">Step {step.step}</div>
                    <div className="text-lg font-bold text-white">
                      {step.description}
                    </div>
                  </div>
                ))}
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Common Interview Questions</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Implement factorial using both recursion and iteration</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Which is more efficient for large inputs?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>When would you choose recursion over iteration?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>How to prevent stack overflow in recursion?</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Convert recursive solution to iterative</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Common Mistakes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Forgetting base case in recursion</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not considering stack overflow risk</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Choosing recursion for simple loops</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Not understanding space complexity differences</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Infinite recursion without proper termination</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Recursion Concepts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/base-cases"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <GitBranch className="w-6 h-6" />
                <h3 className="text-xl font-bold">Base Cases & Recursive Cases</h3>
              </div>
              <p className="text-gray-300">Master recursion termination logic and patterns.</p>
            </Link>
            <Link 
              href="/recursion-tree"
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-bold">Recursion Tree Visualization</h3>
              </div>
              <p className="text-gray-300">Understand call stack and recursion tree patterns.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
