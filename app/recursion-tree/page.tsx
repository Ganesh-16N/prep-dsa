'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Repeat, Clock, Database, Target, Code, Zap, AlertTriangle, CheckCircle, XCircle, DollarSign, TrendingUp, Layers, GitBranch, Brain, ArrowDown, ArrowUp, TreePine, Network, Activity } from 'lucide-react';

interface TreeNode {
  id: string;
  value: number;
  label: string;
  result?: number;
  isBaseCase: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  children: string[];
  parent?: string;
  depth: number;
  x: number;
  y: number;
  description: string;
  callStackFrame?: {
    functionName: string;
    parameter: number;
    returnValue?: number;
    isBaseCase: boolean;
    isReturning: boolean;
  };
}

interface RecursionExample {
  id: string;
  name: string;
  description: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  visualExample: string;
  input: number;
  nodes: TreeNode[];
  callStack: any[];
  treeStructure: string;
}

export default function RecursionTreePage() {
  const [selectedExample, setSelectedExample] = useState('factorial');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState(4);
  const [showCallStack, setShowCallStack] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(2000);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const examples: RecursionExample[] = [
    {
      id: 'factorial',
      name: 'Factorial',
      description: 'Linear recursion tree',
      code: `function factorial(n) {
  if (n === 1) return 1; // Base case
  return n * factorial(n - 1);
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      visualExample: 'factorial(4) = 4 × 3 × 2 × 1 = 24',
      input: 4,
      nodes: [],
      callStack: [],
      treeStructure: `factorial(4)
 └─ 4 * factorial(3)
      └─ 3 * factorial(2)
           └─ 2 * factorial(1)
                └─ 1`
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      description: 'Binary recursion tree',
      code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n)',
      visualExample: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3',
      input: 4,
      nodes: [],
      callStack: [],
      treeStructure: `fib(4)
 ├─ fib(3)
 │   ├─ fib(2)
 │   │   ├─ fib(1)
 │   │   └─ fib(0)
 │   └─ fib(1)
 └─ fib(2)
     ├─ fib(1)
     └─ fib(0)`
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      description: 'Divide & conquer tree',
      code: `function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  let mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
  return binarySearch(arr, target, left, mid - 1);
}`,
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(log n)',
      visualExample: 'Search for 7 in [1,3,5,7,9,11,13]',
      input: 4,
      nodes: [],
      callStack: [],
      treeStructure: `binarySearch([1,3,5,7,9,11,13], 7)
 ├─ mid=3, arr[3]=7 → found!
 └─ (no further calls)`
    }
  ];

  const [examplesState, setExamplesState] = useState(examples);
  const currentExample = examplesState.find(e => e.id === selectedExample) || examplesState[0];

  // Generate recursion tree for current example
  useEffect(() => {
    const generateRecursionTree = () => {
      const nodes: TreeNode[] = [];
      const callStack: any[] = [];
      let nodeId = 0;
      let stepCount = 0;

      if (selectedExample === 'factorial') {
        // Generate factorial recursion tree (linear)
        for (let i = inputValue; i >= 1; i--) {
          const node: TreeNode = {
            id: `node-${nodeId++}`,
            value: i,
            label: `factorial(${i})`,
            isBaseCase: i === 1,
            isActive: false,
            isCompleted: false,
            isExpanded: false,
            children: i > 1 ? [`node-${nodeId}`] : [],
            parent: i < inputValue ? `node-${nodeId - 2}` : undefined,
            depth: inputValue - i,
            x: 0,
            y: inputValue - i,
            description: `Call factorial(${i})`,
            callStackFrame: {
              functionName: 'factorial',
              parameter: i,
              isBaseCase: i === 1,
              isReturning: false
            }
          };
          nodes.push(node);

          // Add call stack frame
          callStack.push({
            step: stepCount++,
            action: 'push',
            description: `Call factorial(${i})`,
            depth: inputValue - i,
            nodeId: node.id
          });

          if (i === 1) {
            // Base case return
            callStack.push({
              step: stepCount++,
              action: 'return',
              description: `Return 1 from factorial(${i})`,
              depth: inputValue - i,
              returnValue: 1,
              nodeId: node.id
            });
          }
        }

        // Add return steps for non-base cases
        let returnValue = 1;
        for (let i = 1; i <= inputValue; i++) {
          returnValue *= i;
          callStack.push({
            step: stepCount++,
            action: 'return',
            description: `Return ${returnValue} from factorial(${i})`,
            depth: inputValue - i,
            returnValue,
            nodeId: `node-${inputValue - i}`
          });
        }
      } else if (selectedExample === 'fibonacci') {
        // Generate Fibonacci recursion tree (binary)
        const generateFibNodes = (n: number, depth: number, parentId?: string): string[] => {
          const currentNodeId = `node-${nodeId++}`;
          const isBaseCase = n <= 1;
          
          const node: TreeNode = {
            id: currentNodeId,
            value: n,
            label: `fib(${n})`,
            isBaseCase,
            isActive: false,
            isCompleted: false,
            isExpanded: false,
            children: [],
            parent: parentId,
            depth,
            x: 0,
            y: depth,
            description: `Call fib(${n})`,
            callStackFrame: {
              functionName: 'fib',
              parameter: n,
              isBaseCase,
              isReturning: false
            }
          };

          if (!isBaseCase) {
            node.children = [
              ...generateFibNodes(n - 1, depth + 1, currentNodeId),
              ...generateFibNodes(n - 2, depth + 1, currentNodeId)
            ];
          }

          nodes.push(node);

          // Add call stack frame
          callStack.push({
            step: stepCount++,
            action: 'push',
            description: `Call fib(${n})`,
            depth,
            nodeId: node.id
          });

          if (isBaseCase) {
            callStack.push({
              step: stepCount++,
              action: 'return',
              description: `Return ${n} from fib(${n})`,
              depth,
              returnValue: n,
              nodeId: node.id
            });
          }

          return [currentNodeId];
        };

        generateFibNodes(inputValue, 0);
      } else if (selectedExample === 'binary-search') {
        // Generate Binary Search recursion tree
        const arr = [1, 3, 5, 7, 9, 11, 13];
        const target = 7;
        
        const generateBinarySearchNodes = (left: number, right: number, depth: number, parentId?: string): string[] => {
          if (left > right) return [];
          
          const mid = Math.floor((left + right) / 2);
          const currentNodeId = `node-${nodeId++}`;
          const isBaseCase = arr[mid] === target || left > right;
          
          const node: TreeNode = {
            id: currentNodeId,
            value: mid,
            label: `search(${left},${right})`,
            result: arr[mid],
            isBaseCase,
            isActive: false,
            isCompleted: false,
            isExpanded: false,
            children: [],
            parent: parentId,
            depth,
            x: 0,
            y: depth,
            description: `Search range [${left},${right}], mid=${mid}, arr[${mid}]=${arr[mid]}`,
            callStackFrame: {
              functionName: 'binarySearch',
              parameter: mid,
              isBaseCase,
              isReturning: false
            }
          };

          if (!isBaseCase) {
            if (arr[mid] < target) {
              node.children = generateBinarySearchNodes(mid + 1, right, depth + 1, currentNodeId);
            } else {
              node.children = generateBinarySearchNodes(left, mid - 1, depth + 1, currentNodeId);
            }
          }

          nodes.push(node);

          callStack.push({
            step: stepCount++,
            action: 'push',
            description: `Search [${left},${right}], mid=${mid}`,
            depth,
            nodeId: node.id
          });

          if (isBaseCase) {
            const returnValue = arr[mid] === target ? mid : -1;
            callStack.push({
              step: stepCount++,
              action: 'return',
              description: `Return ${returnValue} (${arr[mid] === target ? 'found' : 'not found'})`,
              depth,
              returnValue,
              nodeId: node.id
            });
          }

          return [currentNodeId];
        };

        generateBinarySearchNodes(0, arr.length - 1, 0);
      }

      // Update the example with generated data
      setExamplesState(prev => prev.map(e => 
        e.id === selectedExample ? { ...e, nodes, callStack, input: inputValue } : e
      ));
    };

    generateRecursionTree();
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
      }, animationSpeed);
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
  }, [isPlaying, currentStep, currentExample.callStack.length, animationSpeed]);

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

  // Calculate node positions for tree visualization
  const calculateNodePositions = () => {
    const updatedNodes = [...currentExample.nodes];
    
    // Calculate x positions based on tree structure
    updatedNodes.forEach((node, index) => {
      if (node.parent) {
        const parent = updatedNodes.find(n => n.id === node.parent);
        if (parent) {
          const siblings = updatedNodes.filter(n => n.parent === node.parent);
          const siblingIndex = siblings.findIndex(n => n.id === node.id);
          const totalSiblings = siblings.length;
          
          if (totalSiblings === 1) {
            node.x = parent.x;
          } else {
            const spacing = 200;
            const startX = parent.x - (spacing * (totalSiblings - 1)) / 2;
            node.x = startX + spacing * siblingIndex;
          }
        }
      } else {
        node.x = 0; // Root node
      }
    });

    return updatedNodes;
  };

  const positionedNodes = calculateNodePositions();

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
                🌳 Recursion Tree Visualization Mastery
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
            <TreePine className="w-8 h-8" />
            Understanding Recursion Trees
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                A <strong className="text-green-400">recursion tree</strong> is a visual representation of how recursive function calls expand and contract, showing the complete execution flow.
              </p>
              
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  🌳 Tree Structure
                </h3>
                <p className="text-gray-300">
                  Each node represents a function call, with parent nodes spawning child calls that eventually return results back up the tree.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  📚 Call Stack Behavior
                </h3>
                <p className="text-gray-300">
                  Follows <strong>LIFO (Last In, First Out)</strong> principle - the last function called is the first to return.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  👨‍👩‍👧‍👦 Visual Analogy
                </h3>
                <p className="text-gray-300">
                  Think of a <strong>family tree</strong>:
                </p>
                <ul className="text-gray-300 space-y-2 mt-3">
                  <li>• <strong>Parent function</strong> spawns child calls</li>
                  <li>• <strong>Children</strong> return results back up</li>
                  <li>• <strong>Base cases</strong> are the leaf nodes</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                  🎯 Interview Importance
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Analyze time complexity</li>
                  <li>• Understand divide & conquer</li>
                  <li>• Visualize overlapping subproblems</li>
                  <li>• Debug recursive algorithms</li>
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

            {/* Tree Structure */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <TreePine className="w-6 h-6" />
                Tree Structure
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300 whitespace-pre">{currentExample.treeStructure}</pre>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
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
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Animation Speed</label>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="500"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-300 mt-1">{animationSpeed}ms</div>
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
                  <span className="text-gray-300">Action:</span>
                  <span className="text-green-400 font-bold">{currentStepData?.action || 'Ready'}</span>
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
                </div>
              </div>
            </div>

            {/* Recursion Tree Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <TreePine className="w-6 h-6" />
                Recursion Tree Visualization
              </h3>
              
              <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] relative overflow-auto">
                <svg width="100%" height="400" className="overflow-visible">
                  {/* Draw connections */}
                  {positionedNodes.map((node) => {
                    if (node.parent) {
                      const parent = positionedNodes.find(n => n.id === node.parent);
                      if (parent) {
                        return (
                          <line
                            key={`line-${node.id}`}
                            x1={parent.x + 50}
                            y1={parent.y * 60 + 30}
                            x2={node.x + 50}
                            y2={node.y * 60 + 30}
                            stroke={node.isActive ? "#10b981" : "#6b7280"}
                            strokeWidth="2"
                            className="transition-all duration-300"
                          />
                        );
                      }
                    }
                    return null;
                  })}
                  
                  {/* Draw nodes */}
                  {positionedNodes.map((node) => (
                    <g key={node.id}>
                      <rect
                        x={node.x}
                        y={node.y * 60}
                        width="100"
                        height="60"
                        rx="8"
                        className={`transition-all duration-300 ${
                          node.isActive
                            ? 'fill-green-600 stroke-green-500'
                            : node.isCompleted
                            ? 'fill-green-900/20 stroke-green-700'
                            : 'fill-gray-700 stroke-gray-600'
                        }`}
                        strokeWidth="2"
                      />
                      <text
                        x={node.x + 50}
                        y={node.y * 60 + 20}
                        textAnchor="middle"
                        className="text-xs font-bold fill-white"
                      >
                        {node.label}
                      </text>
                      <text
                        x={node.x + 50}
                        y={node.y * 60 + 40}
                        textAnchor="middle"
                        className="text-xs fill-gray-300"
                      >
                        {node.isBaseCase ? 'Base Case' : 'Recursive'}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Call Stack Visualization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <ArrowUp className="w-6 h-6" />
                Call Stack Animation
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
                          {frame.action === 'push' ? '⬇️ Push' : '⬆️ Pop'}
                        </span>
                        <span className="text-xs">
                          Depth: {frame.depth}
                        </span>
                      </div>
                      <div className="text-xs mt-1">
                        {frame.description}
                      </div>
                      {frame.returnValue !== undefined && (
                        <div className="text-green-400 text-xs mt-1">
                          → Returns {frame.returnValue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Context */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Interview Context (20 LPA Level)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">🎯 Why Recursion Trees Matter</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">Time Complexity Analysis</h4>
                  <p className="text-sm text-gray-300">Visualize how many function calls are made</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Divide & Conquer</h4>
                  <p className="text-sm text-gray-300">Essential for merge sort, quicksort, binary search</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Dynamic Programming</h4>
                  <p className="text-sm text-gray-300">Identify overlapping subproblems</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">📊 Complexity Calculation</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Fibonacci</h4>
                  <p className="text-sm text-gray-300">O(2ⁿ) - each call spawns 2 more calls</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Merge Sort</h4>
                  <p className="text-sm text-gray-300">O(n log n) - log n levels, n work per level</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Binary Search</h4>
                  <p className="text-sm text-gray-300">O(log n) - each call halves the input</p>
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
              <li>• Draw recursion trees to analyze complexity</li>
              <li>• Count nodes at each level for time complexity</li>
              <li>• Identify base cases and recursive cases</li>
              <li>• Show how stack grows and shrinks</li>
              <li>• Compare with iterative solutions</li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🚀 Ready to Master More Patterns?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/two-pointers"
              className="bg-green-600 hover:bg-green-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Network className="w-6 h-6" />
                <h3 className="text-xl font-bold">Two Pointers</h3>
              </div>
              <p className="text-gray-300">Learn how to solve array problems with two moving pointers.</p>
            </Link>
            <Link 
              href="/fast-slow-pointers"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-6 h-6" />
                <h3 className="text-xl font-bold">Fast & Slow Pointers</h3>
              </div>
              <p className="text-gray-300">Master linked list problems with different pointer speeds.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
