'use client';

import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useLanguage } from '@/lib/use-language';
import {
  ScanText,
  Palette,
  QrCode,
  Image as ImageIcon,
  Code,
  Zap,
  ArrowRight,
  Binary,
  Wrench,
  RefreshCcw,
} from 'lucide-react';
import NavigationButtons from '@/components/navigation-buttons';

export function ToolsPageClient() {
  const { t } = useLanguage();

  const tools = [
    {
      id: 'ocr',
      title: t.ocrTitle || 'Image Text Recognition',
      description:
        t.ocrSubtitle || 'Extract text from images with support for Russian, English, and digits',
      icon: ScanText,
      href: '/ocr',
      status: 'ready',
      color: 'blue',
      isExternal: false,
    },
    {
      id: 'image-placeholder',
      title: t.imgPhToolTitle || 'Image Placeholder',
      description:
        t.imgPhToolDesc || 'Generate placeholder URLs with custom size or random illustration',
      icon: ImageIcon,
      href: '/image-placeholder',
      status: 'ready',
      color: 'purple',
      isExternal: false,
    },
    {
      id: 'event-loop',
      title: t.eventLoopTitle || 'JavaScript Event Loop',
      description:
        t.eventLoopDescription ||
        'Interactive visualization of the JS runtime: Call Stack, Web APIs, Task Queue and Microtask Queue.',
      icon: RefreshCcw,
      href: '/event-loop',
      status: 'ready',
      color: 'indigo',
      isExternal: false,
    },
    {
      id: 'algorithms',
      title: t.algorithmsTitle || 'Algorithms & Data Structures',
      description:
        t.algorithmsDescription ||
        'Collection of algorithm implementations and data structure solutions from competitive programming practice.',
      icon: Binary,
      href: '/algorithms',
      status: 'ready',
      color: 'green',
      isExternal: false,
    },
    {
      id: 'svg-optimizer',
      title: t.svgOptimizer || 'SVG Optimizer',
      description:
        t.svgOptimizerDesc ||
        'Optimize your SVG code by removing unnecessary attributes, empty groups, and metadata.',
      icon: Zap,
      href: '/svg-optimizer',
      status: 'ready',
      color: 'blue',
      isExternal: false,
    },
    {
      id: 'color-picker',
      title: 'Color Picker & Palette Generator',
      description: 'Extract colors from images and generate beautiful palettes',
      icon: Palette,
      href: '#',
      status: 'coming-soon',
      color: 'purple',
      isExternal: false,
    },
    {
      id: 'qr-generator',
      title: 'QR Code Generator',
      description: 'Generate QR codes for text, URLs, and more',
      icon: QrCode,
      href: '#',
      status: 'coming-soon',
      color: 'indigo',
      isExternal: false,
    },
    {
      id: 'image-optimizer',
      title: 'Image Optimizer',
      description: 'Compress and optimize images for web',
      icon: ImageIcon,
      href: '#',
      status: 'coming-soon',
      color: 'pink',
      isExternal: false,
    },
    {
      id: 'code-formatter',
      title: 'Code Formatter',
      description: 'Format and beautify code in multiple languages',
      icon: Code,
      href: '#',
      status: 'coming-soon',
      color: 'yellow',
      isExternal: false,
    },
  ];

  const experiments = [
    {
      id: 'webgl-demo',
      title: 'WebGL Experiments',
      description: 'Interactive 3D graphics and shaders',
      icon: Zap,
      href: '#',
      status: 'prototype',
      color: 'red',
      isExternal: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Ready
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Coming Soon
          </span>
        );
      case 'prototype':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Prototype
          </span>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (color: string, isReady: boolean) => {
    const baseClasses = isReady
      ? 'hover:shadow-lg transform hover:-translate-y-1 cursor-pointer'
      : 'opacity-75 cursor-not-allowed';

    switch (color) {
      case 'blue':
        return `${baseClasses} ${isReady ? 'hover:border-blue-300 dark:hover:border-blue-600' : ''}`;
      case 'purple':
        return `${baseClasses} ${isReady ? 'hover:border-purple-300 dark:hover:border-purple-600' : ''}`;
      case 'green':
        return `${baseClasses} ${isReady ? 'hover:border-green-300 dark:hover:border-green-600' : ''}`;
      case 'indigo':
        return `${baseClasses} ${isReady ? 'hover:border-indigo-300 dark:hover:border-indigo-600' : ''}`;
      case 'pink':
        return `${baseClasses} ${isReady ? 'hover:border-pink-300 dark:hover:border-pink-600' : ''}`;
      case 'yellow':
        return `${baseClasses} ${isReady ? 'hover:border-yellow-300 dark:hover:border-yellow-600' : ''}`;
      case 'red':
        return `${baseClasses} ${isReady ? 'hover:border-red-300 dark:hover:border-red-600' : ''}`;
      default:
        return baseClasses;
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'indigo':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'pink':
        return 'text-pink-600 dark:text-pink-400';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const ToolCard = ({ tool }: { tool: (typeof tools)[0] }) => {
    const Icon = tool.icon;
    const isReady = tool.status === 'ready';
    const Component = isReady ? Link : 'div';
    const props = isReady ? { href: tool.href } : {};

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      <Component
        {...props}
        className={`relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 ${getColorClasses(tool.color, isReady)}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-900 ${getIconColorClasses(tool.color)}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(tool.status)}
            {isReady && (
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tool.title}</h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.description}</p>
      </Component>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons />
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 md:py-8 py-14">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {t.toolsAndExperiments || 'Tools & Experiments'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.toolsDescription ||
                "A collection of useful tools and experimental features I've built for various purposes. Some are ready to use, others are still in development."}
            </p>
          </div>

          {/* Tools Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {t.tools || 'Tools'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Experiments Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              {t.experiments || 'Experiments'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiments.map((experiment) => (
                <ToolCard key={experiment.id} tool={experiment} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
