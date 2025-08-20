import Link from "next/link";
import { ArrowRight, Code, Zap, Target, BookOpen, Clock, Database, Brain, TrendingUp, Layers, Search, Repeat, Puzzle, GitBranch, Cpu, Network } from "lucide-react";

export default function Home() {
  const topics = [
    {
      category: "📊 Fundamentals",
      items: [
        { name: "Big O Notation", description: "Time & Space Complexity Analysis", href: "/big-o", icon: Clock, difficulty: "Basic" },
        { name: "Time Complexity", description: "Understanding Algorithm Efficiency", href: "/time-complexity", icon: Clock, difficulty: "Basic" },
        { name: "Space Complexity", description: "Memory Usage Analysis", href: "/space-complexity", icon: Database, difficulty: "Basic" },
        { name: "Data Structures Overview", description: "Arrays, Strings, Objects", href: "/data-structures", icon: Layers, difficulty: "Basic" },
      ]
    },
    {
      category: "🔍 Basic Search & Sort",
      items: [
        { name: "Linear Search", description: "Sequential Search Algorithm", href: "/linear-search", icon: Search, difficulty: "Basic" },
        { name: "Binary Search", description: "Divide & Conquer Search", href: "/binary-search", icon: Search, difficulty: "Basic" },
        { name: "Bubble Sort", description: "Simple Sorting Algorithm", href: "/bubble-sort", icon: TrendingUp, difficulty: "Basic" },
        { name: "Selection Sort", description: "In-place Sorting", href: "/selection-sort", icon: TrendingUp, difficulty: "Basic" },
        { name: "Insertion Sort", description: "Adaptive Sorting", href: "/insertion-sort", icon: TrendingUp, difficulty: "Basic" },
      ]
    },
    {
      category: "🔄 Basic Problem Solving",
      items: [
        { name: "Brute Force Approach", description: "Exhaustive Search Strategy", href: "/brute-force", icon: Search, difficulty: "Basic" },
        { name: "Recursion Fundamentals", description: "Function Calling Itself", href: "/recursion", icon: Repeat, difficulty: "Basic" },
        { name: "Iteration vs Recursion", description: "Loop vs Recursive Approach", href: "/iteration-vs-recursion", icon: Repeat, difficulty: "Basic" },
        { name: "Base Cases & Recursive Cases", description: "Recursion Termination Logic", href: "/base-cases", icon: Repeat, difficulty: "Basic" },
        { name: "Recursion Tree Visualization", description: "Understanding Call Stack", href: "/recursion-tree", icon: GitBranch, difficulty: "Basic" },
      ]
    },
    {
      category: "⚡ Optimization Patterns",
      items: [
        { name: "Sliding Window", description: "Efficient Subarray Operations", href: "/sliding-window", icon: Code, difficulty: "Medium" },
        { name: "Two Pointers", description: "Array Traversal Technique", href: "/two-pointers", icon: Target, difficulty: "Medium" },
        { name: "Fast & Slow Pointers", description: "Cycle Detection", href: "/fast-slow-pointers", icon: Target, difficulty: "Medium" },
        { name: "Prefix Sum", description: "Range Sum Queries", href: "/prefix-sum", icon: TrendingUp, difficulty: "Medium" },
        { name: "Kadane's Algorithm", description: "Maximum Subarray Sum", href: "/kadane", icon: TrendingUp, difficulty: "Medium" },
      ]
    },
    {
      category: "🎯 Advanced Problem Solving",
      items: [
        { name: "Divide & Conquer", description: "Problem Decomposition Strategy", href: "/divide-conquer", icon: GitBranch, difficulty: "Medium" },
        { name: "Greedy Algorithms", description: "Local Optimal Choices", href: "/greedy", icon: Target, difficulty: "Medium" },
        { name: "Backtracking", description: "State Space Search", href: "/backtracking", icon: Puzzle, difficulty: "Advanced" },
        { name: "Branch & Bound", description: "Systematic Search with Bounds", href: "/branch-bound", icon: GitBranch, difficulty: "Advanced" },
        { name: "Meet in the Middle", description: "Split Search Space", href: "/meet-middle", icon: Target, difficulty: "Advanced" },
      ]
    },
    {
      category: "🌳 Tree & Graph Algorithms",
      items: [
        { name: "Binary Tree Traversal", description: "Inorder, Preorder, Postorder", href: "/tree-traversal", icon: Layers, difficulty: "Medium" },
        { name: "Binary Search Tree", description: "Ordered Tree Structure", href: "/bst", icon: Layers, difficulty: "Medium" },
        { name: "Depth First Search", description: "Graph Traversal Algorithm", href: "/dfs", icon: Brain, difficulty: "Medium" },
        { name: "Breadth First Search", description: "Level-wise Traversal", href: "/bfs", icon: Brain, difficulty: "Medium" },
        { name: "Topological Sort", description: "Dependency Resolution", href: "/topological-sort", icon: Network, difficulty: "Advanced" },
        { name: "Shortest Path Algorithms", description: "Dijkstra, Bellman-Ford", href: "/shortest-path", icon: Network, difficulty: "Advanced" },
        { name: "Minimum Spanning Tree", description: "Kruskal, Prim's Algorithm", href: "/mst", icon: Network, difficulty: "Advanced" },
      ]
    },
    {
      category: "📈 Dynamic Programming",
      items: [
        { name: "DP Fundamentals", description: "Memoization & Tabulation", href: "/dp-fundamentals", icon: Brain, difficulty: "Advanced" },
        { name: "Fibonacci Series", description: "Classic DP Problem", href: "/fibonacci", icon: Brain, difficulty: "Medium" },
        { name: "Longest Common Subsequence", description: "String DP Problem", href: "/lcs", icon: Brain, difficulty: "Advanced" },
        { name: "Longest Increasing Subsequence", description: "Sequence DP Problem", href: "/lis", icon: Brain, difficulty: "Advanced" },
        { name: "Knapsack Problem", description: "Optimization DP", href: "/knapsack", icon: Brain, difficulty: "Advanced" },
        { name: "Matrix Chain Multiplication", description: "Advanced DP", href: "/matrix-chain", icon: Brain, difficulty: "Advanced" },
        { name: "Edit Distance", description: "String Transformation DP", href: "/edit-distance", icon: Brain, difficulty: "Advanced" },
      ]
    },
    {
      category: "🔗 Advanced Data Structures",
      items: [
        { name: "Linked Lists", description: "Dynamic Data Structure", href: "/linked-lists", icon: Layers, difficulty: "Medium" },
        { name: "Stacks & Queues", description: "LIFO & FIFO Structures", href: "/stacks-queues", icon: Layers, difficulty: "Medium" },
        { name: "Heaps", description: "Priority Queue Implementation", href: "/heaps", icon: Layers, difficulty: "Medium" },
        { name: "Hash Tables", description: "Key-Value Storage", href: "/hash-tables", icon: Database, difficulty: "Medium" },
        { name: "Tries", description: "Prefix Tree Structure", href: "/tries", icon: Layers, difficulty: "Advanced" },
        { name: "Segment Trees", description: "Range Query Data Structure", href: "/segment-trees", icon: GitBranch, difficulty: "Advanced" },
        { name: "Binary Indexed Trees", description: "Fenwick Trees", href: "/fenwick-trees", icon: GitBranch, difficulty: "Advanced" },
      ]
    },
    {
      category: "⚙️ Advanced Sorting",
      items: [
        { name: "Merge Sort", description: "Divide & Conquer Sorting", href: "/merge-sort", icon: TrendingUp, difficulty: "Medium" },
        { name: "Quick Sort", description: "Partition-based Sorting", href: "/quick-sort", icon: TrendingUp, difficulty: "Medium" },
        { name: "Heap Sort", description: "Heap-based Sorting", href: "/heap-sort", icon: TrendingUp, difficulty: "Medium" },
        { name: "Counting Sort", description: "Linear Time Sorting", href: "/counting-sort", icon: TrendingUp, difficulty: "Medium" },
        { name: "Radix Sort", description: "Digit-based Sorting", href: "/radix-sort", icon: TrendingUp, difficulty: "Advanced" },
        { name: "Bucket Sort", description: "Distribution-based Sorting", href: "/bucket-sort", icon: TrendingUp, difficulty: "Advanced" },
      ]
    },
    {
      category: "🔧 Advanced Techniques",
      items: [
        { name: "Bit Manipulation", description: "Binary Operations", href: "/bit-manipulation", icon: Cpu, difficulty: "Advanced" },
        { name: "String Algorithms", description: "KMP, Rabin-Karp", href: "/string-algorithms", icon: Code, difficulty: "Advanced" },
        { name: "Number Theory", description: "Prime, GCD, LCM", href: "/number-theory", icon: Cpu, difficulty: "Advanced" },
        { name: "Geometry Algorithms", description: "Computational Geometry", href: "/geometry", icon: Target, difficulty: "Advanced" },
        { name: "Game Theory", description: "Nim, Grundy Numbers", href: "/game-theory", icon: Puzzle, difficulty: "Advanced" },
        { name: "Advanced Graph Algorithms", description: "Strongly Connected Components", href: "/advanced-graph", icon: Network, difficulty: "Advanced" },
      ]
    },
    {
      category: "🏗️ System Design & Scalability",
      items: [
        { name: "System Design Fundamentals", description: "Scalable Architecture", href: "/system-design", icon: Layers, difficulty: "Advanced" },
        { name: "Distributed Systems", description: "Consistency & Availability", href: "/distributed-systems", icon: Network, difficulty: "Advanced" },
        { name: "Database Design", description: "Normalization & Indexing", href: "/database-design", icon: Database, difficulty: "Advanced" },
        { name: "Caching Strategies", description: "LRU, LFU, TTL", href: "/caching", icon: Database, difficulty: "Advanced" },
        { name: "Load Balancing", description: "Traffic Distribution", href: "/load-balancing", icon: Network, difficulty: "Advanced" },
        { name: "Microservices", description: "Service-Oriented Architecture", href: "/microservices", icon: Network, difficulty: "Advanced" },
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic": return "text-green-400";
      case "Medium": return "text-yellow-400";
      case "Advanced": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🚀 DSA Learning Hub
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Master Data Structures & Algorithms with Interactive Visualizations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-fade-in">
            Learn Algorithms Visually
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            Transform complex algorithms into interactive, step-by-step visual experiences. 
            Understand the logic, see the execution, and master the patterns.
          </p>
        </div>

        {/* Featured Tutorial */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 mb-12 animate-fade-in-scale">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Code className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-400">Featured Tutorial</h3>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">
                🪟 Sliding Window Pattern
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Master one of the most powerful algorithmic patterns with our interactive visualization. 
                See how the sliding window technique optimizes subarray operations from O(n×k) to O(n) time complexity.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-gray-400">Time Complexity</div>
                  <div className="text-lg font-bold text-green-400">O(n)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-gray-400">Space Complexity</div>
                  <div className="text-lg font-bold text-blue-400">O(1)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-gray-400">Difficulty</div>
                  <div className="text-lg font-bold text-yellow-400">Medium</div>
                </div>
              </div>

              <Link 
                href="/sliding-window"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-purple-400">What You'll Learn:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Interactive array visualization with sliding window
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Step-by-step algorithm execution
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Brute force vs optimized approach comparison
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Real-time sum calculation and tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Performance analysis and time complexity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            📚 Complete Learning Path
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            Follow our structured curriculum from fundamentals to advanced concepts. 
            Each topic includes interactive visualizations and step-by-step explanations.
          </p>
          
          <div className="space-y-8">
            {topics.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((topic, topicIndex) => {
                    const IconComponent = topic.icon;
                    return (
                      <Link
                        key={topicIndex}
                        href={topic.href}
                        className="group bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:bg-gray-600/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                            <IconComponent className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {topic.name}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {topic.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className={`text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                                {topic.difficulty}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Interactive Learning</h3>
            <p className="text-gray-400">
              Control the pace with play/pause, step-by-step navigation, and real-time visual feedback.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
            <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-4">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Visual Mastery</h3>
            <p className="text-gray-400">
              See algorithms in action with colorful animations, highlighting, and dynamic state changes.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Code + Output Sync</h3>
            <p className="text-gray-400">
              Watch code execution in real-time with syntax highlighting and line-by-line progression.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
            <div className="p-3 bg-orange-500/20 rounded-lg w-fit mb-4">
              <BookOpen className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Comprehensive Learning</h3>
            <p className="text-gray-400">
              From basic concepts to advanced optimizations with detailed explanations and comparisons.
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-300">
            🚧 More Content Coming Soon
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium">Practice Problems</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-medium">Competitions</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Progress Tracking</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-sm font-medium">Community</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
