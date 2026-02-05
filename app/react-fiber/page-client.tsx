'use client';

import { useState, useEffect, useRef } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { CodeBlock } from '@/components/code-block';
import { useLanguage } from '@/lib/hooks/use-language';
import {
  GitBranch,
  Code,
  Zap,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface FiberNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children: FiberNode[];
  effectTag?: string;
  state?: any;
}

interface AnimationStep {
  step: number;
  description: string;
  highlightNodes: string[];
  dataFlow: Array<{
    from: string;
    to: string;
    type: 'jsx' | 'fiber' | 'reconcile' | 'commit';
  }>;
}

export function ReactFiberClient() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [showDetails, setShowDetails] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const codeTransformations = [
    // Step 1: Original JSX
    {
      language: 'jsx',
      code: `function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="container">
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
      title: t.reactFiberCodeTitles?.originalJSX || 'Original JSX Code',
    },
    // Step 2: AST Representation
    {
      language: 'javascript',
      code: `
// Abstract Syntax Tree (AST) based on ESTree (https://github.com/estree/estree)
// It's very simplified example, you can see real detailed AST here https://ast-explorer.dev

{
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": { "type": "Identifier", "name": "App" },
      "params": [],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "VariableDeclaration",
            "declarations": [
              {
                "type": "VariableDeclarator",
                "id": {
                  "type": "ArrayPattern",
                  "elements": [
                    { "type": "Identifier", "name": "count" },
                    { "type": "Identifier", "name": "setCount" }
                  ]
                },
                "init": {
                  "type": "CallExpression",
                  "callee": { "type": "Identifier", "name": "useState" },
                  "arguments": [{ "type": "Literal", "value": 0 }]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ReturnStatement",
            "argument": {
              "type": "JSXElement",
              "openingElement": {
                "type": "JSXOpeningElement",
                "name": { "type": "JSXIdentifier", "name": "div" },
                "attributes": [
                  {
                    "type": "JSXAttribute",
                    "name": { "type": "JSXIdentifier", "name": "className" },
                    "value": {
                      "type": "StringLiteral",
                      "value": "container"
                    }
                  }
                ]
              },
              "children": [
                {
                  "type": "JSXElement",
                  "openingElement": {
                    "type": "JSXOpeningElement",
                    "name": { "type": "JSXIdentifier", "name": "h1" },
                    "attributes": []
                  },
                  "children": [
                    {
                      "type": "JSXText",
                      "value": "Counter: ",
                      "raw": "Counter: "
                    },
                    {
                      "type": "JSXExpressionContainer",
                      "expression": {
                        "type": "Identifier",
                        "name": "count"
                      }
                    }
                  ],
                  "closingElement": {
                    "type": "JSXClosingElement",
                    "name": { "type": "JSXIdentifier", "name": "h1" }
                  }
                },
                {
                  "type": "JSXElement",
                  "openingElement": {
                    "type": "JSXOpeningElement",
                    "name": { "type": "JSXIdentifier", "name": "button" },
                    "attributes": [
                      {
                        "type": "JSXAttribute",
                        "name": { "type": "JSXIdentifier", "name": "onClick" },
                        "value": {
                          "type": "JSXExpressionContainer",
                          "expression": {
                            "type": "ArrowFunctionExpression",
                            "params": [],
                            "body": {
                              "type": "CallExpression",
                              "callee": {
                                "type": "Identifier",
                                "name": "setCount"
                              },
                              "arguments": [
                                {
                                  "type": "BinaryExpression",
                                  "operator": "+",
                                  "left": {
                                    "type": "Identifier",
                                    "name": "count"
                                  },
                                  "right": {
                                    "type": "Literal",
                                    "value": 1
                                  }
                                }
                              ]
                            }
                          }
                        }
                      }
                    ]
                  },
                  "children": [
                    {
                      "type": "JSXText",
                      "value": "Increment",
                      "raw": "Increment"
                    }
                  ],
                  "closingElement": {
                    "type": "JSXClosingElement",
                    "name": { "type": "JSXIdentifier", "name": "button" }
                  }
                }
              ],
              "closingElement": {
                "type": "JSXClosingElement",
                "name": { "type": "JSXIdentifier", "name": "div" }
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}`,

      title: t.reactFiberCodeTitles?.astRepresentation || 'AST (Abstract Syntax Tree)',
    },
    // Step 3: React.createElement calls
    {
      language: 'javascript',
      code: `// Transpiled JavaScript (Babel output)
function App() {
  const [count, setCount] = useState(0);
  
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "h1",
      null,
      "Counter: ",
      count
    ),
    React.createElement(
      "button",
      { onClick: () => setCount(count + 1) },
      "Increment"
    )
  );
}`,
      title: t.reactFiberCodeTitles?.createElementCalls || 'React.createElement Calls',
    },
    // Step 4: React Elements (Virtual DOM)
    {
      language: 'javascript',
      code: `// React Elements (Virtual DOM objects)
const element = {
  type: "div",
  props: {
    className: "container",
    children: [
      {
        type: "h1",
        props: {
          children: ["Counter: ", 0]
        }
      },
      {
        type: "button",
        props: {
          onClick: () => setCount(count + 1),
          children: ["Increment"]
        }
      }
    ]
  }
};

// Fiber nodes created from elements
    fiberApp = {
      tag: FunctionComponent,
      type: App,
      key: null,
      stateNode: null, // FC has no instance
      return: null, // Parent node
      child: fiberDiv, // First child node - div
      sibling: null,
      index: 0,
      ref: null,
      pendingProps: {},
      memoizedProps: {},
      memoizedState: {
        baseState: 0,
        baseQueue: null,
        memoizedState: 0,
        queue: {
          pending: null,
          dispatch: () => {},
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: 0
        }
      },
      updateQueue: null,
      mode: ConcurrentMode,
      effectTag: NoEffect,
      nextEffect: null,
      firstEffect: null,
      lastEffect: null,
      expirationTime: NoWork,
      childExpirationTime: NoWork,
      alternate: null 
    }

    fiberDiv = {
      tag: HostComponent, // 5
      type: "div",
      key: null,
      stateNode: null, // will create later
      return: fiberApp, // Parent node - App fiber
      child: fiberH1, // First child node - h1
      sibling: null,
      index: 0,
      ref: null,
      pendingProps: { className: "container", children: [...] },
      memoizedProps: null,
      updateQueue: null,
      mode: ConcurrentMode,
      effectTag: Placement, // DOM effect
      nextEffect: null,
      firstEffect: fiberH1, // First effect in list
      lastEffect: fiberButton, // Last effect in list
      expirationTime: Sync,
      childExpirationTime: Sync,
      alternate: null
    };`,
      title: t.reactFiberCodeTitles?.reactElements || 'React Elements & Fiber Nodes',
    },
    // Step 5: Final HTML
    {
      language: 'html',
      code: `<!-- Final HTML output -->
<div class="container">
  <h1>Counter: 0</h1>
  <button onclick="() => setCount(count + 1)">
    Increment
  </button>
</div>

<!-- DOM updates applied -->
- div.container: PLACEMENT
- h1: PLACEMENT  
- text "Counter: 0": PLACEMENT
- button: PLACEMENT
- text "Increment": PLACEMENT`,
      title: t.reactFiberCodeTitles?.finalHTML || 'Final HTML & DOM Updates',
    },
  ];

  const fiberTree: FiberNode = {
    id: 'root',
    type: 'App',
    props: {},
    children: [
      {
        id: 'div-1',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'h1-1',
            type: 'h1',
            props: {},
            children: [
              {
                id: 'text-1',
                type: 'TEXT_ELEMENT',
                props: { nodeValue: 'Counter: ' },
                children: [],
              },
              {
                id: 'text-2',
                type: 'TEXT_ELEMENT',
                props: { nodeValue: '0' },
                children: [],
              },
            ],
          },
          {
            id: 'button-1',
            type: 'button',
            props: { onClick: '() => setCount(count + 1)' },
            children: [
              {
                id: 'text-3',
                type: 'TEXT_ELEMENT',
                props: { nodeValue: 'Increment' },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const animationSteps: AnimationStep[] = [
    {
      step: 1,
      description: t.reactFiberSteps?.jsxParsing || 'JSX Code Parsing',
      highlightNodes: ['root'],
      dataFlow: [
        { from: 'jsx-source', to: 'babel-parser', type: 'jsx' },
        { from: 'babel-parser', to: 'ast', type: 'jsx' },
      ],
    },
    {
      step: 2,
      description: t.reactFiberSteps?.astToElements || 'AST to React Elements',
      highlightNodes: ['root'],
      dataFlow: [
        { from: 'ast', to: 'react-elements', type: 'jsx' },
        { from: 'react-elements', to: 'VDOM & fiber-tree', type: 'fiber' },
      ],
    },
    {
      step: 3,
      description: t.reactFiberSteps?.fiberCreation || 'Fiber Tree Creation',
      highlightNodes: ['root', 'div-1'],
      dataFlow: [{ from: 'fiber-tree', to: 'work-in-progress', type: 'fiber' }],
    },
    {
      step: 4,
      description: t.reactFiberSteps?.reconciliation || 'Reconciliation Phase',
      highlightNodes: ['div-1', 'h1-1', 'button-1'],
      dataFlow: [{ from: 'work-in-progress', to: 'reconciliation', type: 'reconcile' }],
    },
    {
      step: 5,
      description: t.reactFiberSteps?.commit || 'Commit Phase',
      highlightNodes: ['text-1', 'text-2', 'text-3'],
      dataFlow: [{ from: 'reconciliation', to: 'dom-updates', type: 'commit' }],
    },
  ];

  const getStepDetails = (step: number) => {
    switch (step) {
      case 1:
        return (
          t.reactFiberDetails?.jsxParsing ||
          'Babel parser transforms JSX syntax into JavaScript code. JSX elements (like <div>, <h1>) become React.createElement() calls. This allows browsers to understand JSX as regular JavaScript.'
        );
      case 2:
        return (
          t.reactFiberDetails?.astToElements ||
          'Abstract Syntax Tree (AST) is converted to React elements - objects describing component structure. Each JSX element becomes an object with type, props, and children.'
        );
      case 3:
        return (
          t.reactFiberDetails?.fiberCreation ||
          'React creates Fiber tree - internal data structure for tracking components. Each Fiber node contains information about the component, its state, and relationships with other nodes.'
        );
      case 4:
        return (
          t.reactFiberDetails?.reconciliation ||
          'Reconciliation phase compares new Fiber tree with previous one and determines what changes need to be made to DOM. React uses diffing algorithm to optimize updates.'
        );
      case 5:
        return (
          t.reactFiberDetails?.commit ||
          'Commit phase applies all changes to the real DOM. React updates only elements that actually changed, ensuring high performance.'
        );
      default:
        return '';
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % animationSteps.length);
      }, speed);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, speed, animationSteps.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % animationSteps.length);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const renderFiberNode = (node: FiberNode, level = 0) => {
    const isHighlighted = animationSteps[currentStep]?.highlightNodes.includes(node.id);
    const indent = '  '.repeat(level);

    return (
      <div key={node.id} className="font-mono text-sm">
        <div
          className={`p-2 rounded transition-all duration-500 ${
            isHighlighted
              ? 'bg-cyan-100 dark:bg-cyan-900 border-2 border-cyan-400'
              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{indent}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{node.type}</span>
            {node.effectTag && (
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                {node.effectTag}
              </span>
            )}
          </div>
          {showDetails && node.props && Object.keys(node.props).length > 0 && (
            <div className="ml-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
              {Object.entries(node.props).map(([key, value]) => (
                <div key={key}>
                  {indent} {key}: {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>
        {node.children.map((child) => renderFiberNode(child, level + 1))}
      </div>
    );
  };

  const renderDataFlow = () => {
    const currentDataFlow = animationSteps[currentStep]?.dataFlow || [];

    return (
      <div className="space-y-4">
        {currentDataFlow.map((flow, index) => (
          <div key={index} className="flex items-center gap-4 animate-pulse">
            <div
              className={`w-4 h-4 rounded-full ${
                flow.type === 'jsx'
                  ? 'bg-green-500'
                  : flow.type === 'fiber'
                    ? 'bg-blue-500'
                    : flow.type === 'reconcile'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
              }`}
            />
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{flow.from}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{flow.to}</span>
            <span
              className={`px-2 py-1 text-xs rounded ${
                flow.type === 'jsx'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : flow.type === 'fiber'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : flow.type === 'reconcile'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}
            >
              {flow.type}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-cyan-600 dark:text-cyan-400">
              <GitBranch className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">
              {t.reactFiberTitle || 'React Fiber & JSX Parser'}
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
            {t.reactFiberDescription ||
              'Interactive visualization of how React parses JSX and processes it through the Fiber reconciliation algorithm. Watch the data flow from JSX source to DOM updates with animated steps.'}
          </p>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5" />{' '}
                {t.reactFiberSections?.animationControls || 'Animation Controls'}
              </h2>
            </div>
            <div className="my-4 flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying
                  ? t.reactFiberControls?.pause || 'Pause'
                  : t.reactFiberControls?.play || 'Play'}
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                {t.reactFiberControls?.nextStep || 'Step'}
              </button>
              <button
                onClick={resetAnimation}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {t.reactFiberControls?.reset || 'Reset'}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">
                {t.reactFiberControls?.speed || 'Speed'}:
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="250"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{speed}ms</span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                {showDetails ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {showDetails
                  ? t.reactFiberControls?.hideDetails || 'Hide Node Details'
                  : t.reactFiberControls?.showDetails || 'Show Node Details'}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Transformation */}
            <div className="overflow-auto bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />{' '}
                {codeTransformations[currentStep]?.title || 'Code Transformation'}
              </h3>
              <div className="mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Step {currentStep + 1}: {animationSteps[currentStep]?.description}
                </span>
              </div>
              <CodeBlock
                key={`code-step-${currentStep}`}
                language={
                  (codeTransformations[currentStep]?.language as
                    | 'jsx'
                    | 'javascript'
                    | 'js'
                    | 'typescript'
                    | 'ts'
                    | 'tsx'
                    | 'xml') || 'javascript'
                }
                code={codeTransformations[currentStep]?.code || ''}
              />
            </div>

            {/* Current Step */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">
                {t.reactFiberSections?.currentStep || 'Current Step'}
              </h3>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  Step {currentStep + 1} of {animationSteps.length}
                </div>
                <div className="text-lg font-medium">
                  {animationSteps[currentStep]?.description}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {getStepDetails(currentStep + 1)}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / animationSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Flow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 my-8">
            <h3 className="text-lg font-semibold mb-4">
              {t.reactFiberSections?.dataFlow || 'Data Flow'}
            </h3>
            {renderDataFlow()}
          </div>

          {/* Fiber Tree */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              {t.reactFiberSections?.fiberTree || 'Fiber Tree Structure'}
            </h3>
            <div className="space-y-2">{renderFiberNode(fiberTree)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
