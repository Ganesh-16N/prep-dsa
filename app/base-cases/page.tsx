'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Repeat, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, TrendingUp, Layers, GitBranch, Brain, ArrowDown, ArrowUp } from 'lucide-react';

interface RecursionNode {
  id: string;
  value: number;
  result?: number;
  isBaseCase: boolean;
  isActive: boolean;
  isCompleted: boolean;
  children: string[];
  parent?: string;
  depth: number;
  description: string;
}

interface CallStackFrame {
  functionName: string;
  parameter: number;
  returnValue?: number;
  isBaseCase: boolean;
  isActive: boolean;
  isReturning: boolean;
  depth: number;
  description: string;
}

interface RecursionExample {
  id: string;
  name: string;
  description: string;
  code: string;
  baseCaseCode: string;
  recursiveCaseCode: string;
  baseCaseExplanation: string;
  recursiveCaseExplanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  visualExample: string;
  input: number;
  nodes: RecursionNode[];
  callStack: CallStackFrame[];
}

export default function BaseCasesPage() {
  const [selectedExample, setSelectedExample] = useState('factorial');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState(3);
  const [showCallStack, setShowCallStack] = useState(true);
  const [showTree, setShowTree] = useState(true);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const examples: RecursionExample[] = [
    {
      id: 'factorial',
      name: 'Factorial',
      description: 'Calculate n! using recursion',
      code: `function factorial(n) {
  // Base Case
  if (n === 0) return 1;

  // Recursive Case
  return n * factorial(n - 1);
}`,
      baseCaseCode: 'if (n === 0) return 1;',
      recursiveCaseCode: 'return n * factorial(n - 1);',
      baseCaseExplanation: 'When n reaches 0, we return 1 (stopping condition)',
      recursiveCaseExplanation: 'Multiply n by factorial of (n-1)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      visualExample: 'factorial(3) = 3 × 2 × 1 = 6',
      input: 3,
      nodes: [],
      callStack: []
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      description: 'Calculate nth Fibonacci number',
      code: `function fib(n) {
  // Base Case
  if (n <= 1) return n;

  // Recursive Case
  return fib(n - 1) + fib(n - 2);
}`,
      baseCaseCode: 'if (n <= 1) return n;',
      recursiveCaseCode: 'return fib(n - 1) + fib(n - 2);',
      baseCaseExplanation: 'When n is 0 or 1, return n directly',
      recursiveCaseExplanation: 'Sum of previous two Fibonacci numbers',
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n)',
      visualExample: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3',
      input: 4,
      nodes: [],
      callStack: []
    },
    {
      id: 'sum-array',
      name: 'Sum of Array',
      description: 'Calculate sum of array elements',
      code: `function sumArray(arr, n) {
  // Base Case
  if (n === 0) return 0;

  // Recursive Case
  return arr[n - 1] + sumArray(arr, n - 1);
}`,
      baseCaseCode: 'if (n === 0) return 0;',
      recursiveCaseCode: 'return arr[n - 1] + sumArray(arr, n - 1);',
      baseCaseExplanation: 'When no elements left (n=0), return 0',
      recursiveCaseExplanation: 'Add current element to sum of remaining elements',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      visualExample: 'sum([1,2,3], 3) = 3 + sum([1,2], 2) = 6',
      input: 3,
      nodes: [],
      callStack: []
    }
  ];

  const [examplesState, setExamplesState] = useState(examples);
  const currentExample = examplesState.find(e => e.id === selectedExample) || examplesState[0];

  // Generate recursion tree and call stack for current example
  useEffect(() => {
    const generateRecursionData = () => {
      const nodes: RecursionNode[] = [];
      const callStack: CallStackFrame[] = [];
      let nodeId = 0;

      if (selectedExample === 'factorial') {
        // Generate factorial recursion tree
        for (let i = inputValue; i >= 0; i--) {
          const node: RecursionNode = {
            id: `node-${nodeId++}`,
            value: i,
            isBaseCase: i === 0,
            isActive: false,
            isCompleted: false,
            children: i > 0 ? [`node-${nodeId}`] : [],
            parent: i < inputValue ? `node-${nodeId - 2}` : undefined,
            depth: inputValue - i,
            description: `factorial(${i})`
          };
          nodes.push(node);

          // Add call stack frame
          callStack.push({
            functionName: 'factorial',
            parameter: i,
            isBaseCase: i === 0,
            isActive: false,
            isReturning: false,
            depth: inputValue - i,
            description: `Call factorial(${i})`
          });

          if (i === 0) {
            // Base case return
            callStack.push({
              functionName: 'factorial',
              parameter: i,
              returnValue: 1,
              isBaseCase: true,
              isActive: false,
              isReturning: true,
              depth: inputValue - i,
              description: `Return 1 from factorial(${i})`
            });
          }
        }

        // Add return steps for non-base cases
        let returnValue = 1;
        for (let i = 1; i <= inputValue; i++) {
          returnValue *= i;
          callStack.push({
            functionName: 'factorial',
            parameter: i,
            returnValue,
            isBaseCase: false,
            isActive: false,
            isReturning: true,
            depth: inputValue - i,
            description: `Return ${returnValue} from factorial(${i})`
          });
        }
      } else if (selectedExample === 'fibonacci') {
        // Simplified Fibonacci (linear path)
        for (let i = inputValue; i >= 0; i--) {
          const node: RecursionNode = {
            id: `node-${nodeId++}`,
            value: i,
            isBaseCase: i <= 1,
            isActive: false,
            isCompleted: false,
            children: i > 1 ? [`node-${nodeId}`, `node-${nodeId + 1}`] : [],
            parent: i < inputValue ? `node-${nodeId - 2}` : undefined,
            depth: inputValue - i,
            description: `fib(${i})`
          };
          nodes.push(node);

          callStack.push({
            functionName: 'fib',
            parameter: i,
            isBaseCase: i <= 1,
            isActive: false,
            isReturning: false,
            depth: inputValue - i,
            description: `Call fib(${i})`
          });

          if (i <= 1) {
            callStack.push({
              functionName: 'fib',
              parameter: i,
              returnValue: i,
              isBaseCase: true,
              isActive: false,
              isReturning: true,
              depth: inputValue - i,
              description: `Return ${i} from fib(${i})`
            });
          }
        }

        // Add return steps
        for (let i = 2; i <= inputValue; i++) {
          const fibValue = i <= 3 ? (i === 2 ? 1 : 2) : 3;
          callStack.push({
            functionName: 'fib',
            parameter: i,
            returnValue: fibValue,
            isBaseCase: false,
            isActive: false,
            isReturning: true,
            depth: inputValue - i,
            description: `Return ${fibValue} from fib(${i})`
          });
        }
      } else if (selectedExample === 'sum-array') {
        // Generate sum array recursion
        for (let i = inputValue; i >= 0; i--) {
          const node: RecursionNode = {
            id: `node-${nodeId++}`,
            value: i,
            isBaseCase: i === 0,
            isActive: false,
            isCompleted: false,
            children: i > 0 ? [`node-${nodeId}`] : [],
            parent: i < inputValue ? `node-${nodeId - 2}` : undefined,
            depth: inputValue - i,
            description: `sumArray(arr, ${i})`
          };
          nodes.push(node);

          callStack.push({
            functionName: 'sumArray',
            parameter: i,
            isBaseCase: i === 0,
            isActive: false,
            isReturning: false,
            depth: inputValue - i,
            description: `Call sumArray(arr, ${i})`
          });

          if (i === 0) {
            callStack.push({
              functionName: 'sumArray',
              parameter: i,
              returnValue: 0,
              isBaseCase: true,
              isActive: false,
              isReturning: true,
              depth: inputValue - i,
              description: `Return 0 from sumArray(arr, ${i})`
            });
          }
        }

        // Add return steps
        let returnValue = 0;
        for (let i = 1; i <= inputValue; i++) {
          returnValue += i;
          callStack.push({
            functionName: 'sumArray',
            parameter: i,
            returnValue,
            isBaseCase: false,
            isActive: false,
            isReturning: true,
            depth: inputValue - i,
            description: `Return ${returnValue} from sumArray(arr, ${i})`
          });
        }
      }

      // Update the example with generated data
      setExamplesState(prev => prev.map(e => 
        e.id === selectedExample ? { ...e, nodes, callStack, input: inputValue } : e
      ));
    };

    generateRecursionData();
    setCurrentStep(0);
  }, [selectedExample, inputValue]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < currentExample.callStack.length) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= currentExample.callStack.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
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
  }, [isPlaying, currentStep, currentExample.callStack.length]);

  const nextStep = () => {
    if (currentStep < currentExample.callStack.length - 1) {
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
    if (currentStep >= currentExample.callStack.length - 1) {
      resetSteps();
    }
    setIsPlaying(!isPlaying);
  };

  const currentStepData = currentExample.callStack[currentStep];

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
                🎯 Base Cases & Recursive Cases Mastery
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
          <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center gap-3">
            <GitBranch className="w-8 h-8" />
            Understanding Base Cases & Recursive Cases
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                <strong className="text-green-400">Recursion</strong> has two essential components that work together to solve problems by breaking them into smaller subproblems.
              </p>
              
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  🏠 Base Case
                </h3>
                <p className="text-gray-300">
                  The <strong>stopping condition</strong> where recursion terminates. This prevents infinite recursion and provides the foundation for building the solution.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  🔄 Recursive Case
                </h3>
                <p className="text-gray-300">
                  The part where the function calls itself with a smaller input, moving toward the base case.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  🏃‍♂️ Visual Analogy
                </h3>
                <p className="text-gray-300">
                  Think of <strong>climbing down stairs</strong>:
                </p>
                <ul className="text-gray-300 space-y-2 mt-3">
                  <li>• <strong>Base Case:</strong> Reaching the ground (stopping point)</li>
                  <li>• <strong>Recursive Case:</strong> Taking the next step down</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                  ⚠️ Common Mistakes
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Missing base case → infinite recursion</li>
                  <li>• Base case not reachable → stack overflow</li>
                  <li>• Wrong base case → incorrect results</li>
                  <li>• Not moving toward base case → infinite loop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example Selector */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">🎯 Choose a Recursion Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedExample === example.id
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <h3 className="font-bold mb-2">{example.name}</h3>
                <p className="text-sm opacity-80">{example.description}</p>
                <div className="mt-2 text-xs">
                  <span className="text-red-400">Time: {example.timeComplexity}</span>
                  <span className="mx-2">|</span>
                  <span className="text-blue-400">Space: {example.spaceComplexity}</span>
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
                Recursive Implementation
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{currentExample.code}</pre>
              </div>
            </div>

            {/* Base Case vs Recursive Case */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                Base Case vs Recursive Case
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Base Case</h4>
                  <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm mb-2">
                    <pre className="text-green-300">{currentExample.baseCaseCode}</pre>
                  </div>
                  <p className="text-gray-300 text-sm">{currentExample.baseCaseExplanation}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Recursive Case</h4>
                  <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm mb-2">
                    <pre className="text-blue-300">{currentExample.recursiveCaseCode}</pre>
                  </div>
                  <p className="text-gray-300 text-sm">{currentExample.recursiveCaseExplanation}</p>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Complexity Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Time Complexity</h4>
                  <p className="text-2xl font-bold text-white">{currentExample.timeComplexity}</p>
                  <p className="text-sm text-gray-300 mt-1">Function calls</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Space Complexity</h4>
                  <p className="text-2xl font-bold text-white">{currentExample.spaceComplexity}</p>
                  <p className="text-sm text-gray-300 mt-1">Call stack depth</p>
                </div>
              </div>
            </div>

            {/* Visual Example */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <Target className="w-6 h-6" />
                How It Works
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-300">{currentExample.visualExample}</p>
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
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
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
                  disabled={currentStep >= currentExample.callStack.length - 1}
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
                  <label className="block text-sm text-gray-400 mb-2">Input Value</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-300 mt-1">{inputValue}</div>
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
                  <span className="text-white font-bold">{currentStep + 1} / {currentExample.callStack.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Call Stack Depth:</span>
                  <span className="text-green-400 font-bold">{currentStepData?.depth || 0}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / currentExample.callStack.length) * 100}%` }}
                  ></div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    {currentStepData?.description || 'Ready to start...'}
                  </p>
                  {currentStepData?.isBaseCase && (
                    <div className="mt-2 text-green-400 text-sm font-bold">✅ Base Case Reached!</div>
                  )}
                  {currentStepData?.isReturning && (
                    <div className="mt-2 text-blue-400 text-sm font-bold">🔄 Returning Value</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recursion Tree Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                Recursion Tree Visualization
              </h3>
              
              <div className="bg-gray-900 rounded-lg p-4 min-h-[300px]">
                <div className="flex flex-col-reverse gap-2">
                  {currentExample.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        index === currentStep
                          ? 'bg-green-600 border-green-500 text-white'
                          : index < currentStep
                          ? 'bg-green-900/20 border-green-700 text-green-300'
                          : 'bg-gray-700 border-gray-600 text-gray-300'
                      }`}
                      style={{ marginLeft: `${node.depth * 40}px` }}
                    >
                      <div className="text-center">
                        <div className="font-bold">{node.description}</div>
                        <div className="text-sm opacity-80">
                          {node.isBaseCase ? 'Base Case' : 'Recursive Case'}
                        </div>
                        {node.isBaseCase && (
                          <div className="text-green-400 text-xs font-bold mt-1">✅</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call Stack Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <ArrowUp className="w-6 h-6" />
                Call Stack Visualization
              </h3>
              
              <div className="bg-gray-900 rounded-lg p-4 min-h-[200px]">
                <div className="flex flex-col-reverse gap-1">
                  {currentExample.callStack.slice(0, currentStep + 1).map((frame, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border transition-all ${
                        index === currentStep
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-blue-900/20 border-blue-700 text-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">
                          {frame.functionName}({frame.parameter})
                        </span>
                        <span className="text-xs">
                          Depth: {frame.depth}
                        </span>
                      </div>
                      {frame.returnValue !== undefined && (
                        <div className="text-green-400 text-xs mt-1">
                          → Returns {frame.returnValue}
                        </div>
                      )}
                      {frame.isBaseCase && (
                        <div className="text-green-400 text-xs font-bold mt-1">Base Case</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Result Display */}
        {currentStep >= currentExample.callStack.length - 1 && currentExample.callStack.length > 0 && (
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-400">🎉 Recursion Complete!</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-4">
                {currentExample.name === 'Factorial' && `${inputValue}! = ${currentExample.callStack[currentExample.callStack.length - 1]?.returnValue}`}
                {currentExample.name === 'Fibonacci' && `fib(${inputValue}) = ${currentExample.callStack[currentExample.callStack.length - 1]?.returnValue}`}
                {currentExample.name === 'Sum of Array' && `sum([1...${inputValue}]) = ${currentExample.callStack[currentExample.callStack.length - 1]?.returnValue}`}
              </div>
              <p className="text-gray-300 text-lg">
                The recursion successfully reached the base case and computed the result!
              </p>
            </div>
          </div>
        )}

        {/* Step-by-Step Walkthrough */}
        {currentExample.callStack.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">📋 Step-by-Step Walkthrough</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentExample.callStack.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    index === currentStep
                      ? 'bg-green-600 border-green-500'
                      : index < currentStep
                      ? 'bg-green-900/20 border-green-700'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Step {index + 1}</span>
                    <span className="text-sm text-green-400">Depth {step.depth}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{step.description}</p>
                  <div className="font-mono text-xs">
                    {step.functionName}({step.parameter})
                    {step.returnValue !== undefined && (
                      <span className="text-green-400"> → {step.returnValue}</span>
                    )}
                  </div>
                  {step.isBaseCase && (
                    <div className="mt-2 text-green-400 text-sm font-bold">✅ Base Case</div>
                  )}
                  {step.isReturning && !step.isBaseCase && (
                    <div className="mt-2 text-blue-400 text-sm font-bold">🔄 Returning</div>
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
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Common Interview Questions</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">Basic Recursion</h4>
                  <p className="text-sm text-gray-300">Write recursive factorial, fibonacci, sum of digits</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Concept Understanding</h4>
                  <p className="text-sm text-gray-300">Explain base case vs recursive case</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Error Prevention</h4>
                  <p className="text-sm text-gray-300">Preventing infinite recursion (missing base case)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">⚡ Optimization Discussion</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Recursion vs Iteration</h4>
                  <p className="text-sm text-gray-300">Trade-offs between recursive and iterative approaches</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Stack Overflow Risks</h4>
                  <p className="text-sm text-gray-300">Understanding and preventing stack overflow</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Tail Recursion</h4>
                  <p className="text-sm text-gray-300">Advanced optimization technique</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
            <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Interview Tips
            </h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Always identify base case first before writing recursive case</li>
              <li>• Ensure base case is reachable and terminates recursion</li>
              <li>• Consider stack overflow for deep recursion</li>
              <li>• Compare with iterative solution when asked</li>
              <li>• Draw recursion tree for complex problems</li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Recursion?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/recursion-tree"
              className="bg-green-600 hover:bg-green-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-bold">Recursion Tree Visualization</h3>
              </div>
              <p className="text-gray-300">Understand call stack and recursion tree patterns.</p>
            </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
}
