'use client';

import { useState, useRef } from 'react';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Download, Copy, Check, AlertCircle, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import NavigationButtons from '@/components/navigation-buttons';

export function SVGOptimizerPageClient() {
  const { t } = useLanguage();
  const [inputSvg, setInputSvg] = useState<string>('');
  const [optimizedSvg, setOptimizedSvg] = useState<string>('');
  const [jsxCode, setJsxCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<{
    originalSize: number;
    optimizedSize: number;
    savings: number;
    savingsPercent: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedJsx, setCopiedJsx] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOptimize = async () => {
    if (!inputSvg.trim()) {
      setError(t.svgErrorEnterCode || 'Please enter SVG code to optimize');
      return;
    }

    setIsProcessing(true);
    setError('');
    setOptimizedSvg('');
    setStats(null);

    try {
      const response = await fetch('/api/svg-optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ svg: inputSvg }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize SVG');
      }

      const result = await response.json();
      setOptimizedSvg(result.optimizedSvg);
      setStats(result.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedSvg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toCamelCase = (attr: string) => {
    return attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  };

  const parseStyleToObject = (style: string) => {
    const obj: Record<string, string | number> = {};
    style.split(';').forEach((part) => {
      const [rawKey, rawVal] = part.split(':');
      if (!rawKey || !rawVal) return;
      const key = toCamelCase(rawKey.trim());
      const valStr = rawVal.trim();
      const num = Number(valStr);
      obj[key] = isNaN(num) ? valStr : num;
    });
    return obj;
  };

  const convertSvgToJsx = (svg: string) => {
    // Common SVG->JSX attribute mappings (including namespaced and kebab-case)
    const attrMap: Record<string, string> = {
      class: 'className',
      for: 'htmlFor',
      'stroke-linecap': 'strokeLinecap',
      'stroke-linejoin': 'strokeLinejoin',
      'stroke-miterlimit': 'strokeMiterlimit',
      'stroke-width': 'strokeWidth',
      'stroke-dasharray': 'strokeDasharray',
      'stroke-dashoffset': 'strokeDashoffset',
      'stop-color': 'stopColor',
      'stop-opacity': 'stopOpacity',
      'fill-rule': 'fillRule',
      'clip-rule': 'clipRule',
      'clip-path': 'clipPath',
      'color-interpolation': 'colorInterpolation',
      'color-interpolation-filters': 'colorInterpolationFilters',
      'color-rendering': 'colorRendering',
      'dominant-baseline': 'dominantBaseline',
      'alignment-baseline': 'alignmentBaseline',
      'baseline-shift': 'baselineShift',
      'flood-color': 'floodColor',
      'flood-opacity': 'floodOpacity',
      'lighting-color': 'lightingColor',
      'marker-start': 'markerStart',
      'marker-mid': 'markerMid',
      'marker-end': 'markerEnd',
      'pointer-events': 'pointerEvents',
      'shape-rendering': 'shapeRendering',
      'text-anchor': 'textAnchor',
      'vector-effect': 'vectorEffect',
      'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
      'glyph-orientation-vertical': 'glyphOrientationVertical',
      'letter-spacing': 'letterSpacing',
      'word-spacing': 'wordSpacing',
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      'font-style': 'fontStyle',
      'font-weight': 'fontWeight',
      'text-decoration': 'textDecoration',
      'text-rendering': 'textRendering',
      'image-rendering': 'imageRendering',
      'enable-background': 'enableBackground',
      'preserve-aspect-ratio': 'preserveAspectRatio',
      'gradient-units': 'gradientUnits',
      'gradient-transform': 'gradientTransform',
      'pattern-units': 'patternUnits',
      'pattern-content-units': 'patternContentUnits',
      spreadMethod: 'spreadMethod',
      'xlink:href': 'xlinkHref',
      'xml:space': 'xmlSpace',
      'xmlns:xlink': 'xmlnsXlink',
      viewBox: 'viewBox',
    };

    let output = svg;
    // Replace attributes to camelCase
    output = output.replace(
      /\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)=("[^"]*"|'[^']*')/g,
      (match, attr, value) => {
        const rawName = String(attr);
        const v = String(value);
        // Normalize namespaced to kebab for mapping fallback (e.g., xlink:href)
        const normalized = rawName.includes(':') ? rawName : rawName;
        const mapped =
          attrMap[normalized] ||
          attrMap[normalized.toLowerCase()] ||
          toCamelCase(normalized.replace(/:/g, '-'));
        return ` ${mapped}=${v}`;
      }
    );

    // Convert inline style to JSX object
    output = output.replace(/style=("([^"]*)"|'([^']*)')/g, (_m, _g1, g2) => {
      const styleStr = g2 ?? '';
      const obj = parseStyleToObject(styleStr);
      return `style={${JSON.stringify(obj).replace(/"([^("]+)":/g, '$1: ')}}`;
    });

    // Self-close empty elements where appropriate (basic)
    output = output.replace(/<([a-zA-Z][^>\s]*)\s*><\/\1>/g, '<$1 />');
    return output;
  };

  const handleConvertToJsx = () => {
    try {
      const source = optimizedSvg || inputSvg;
      const jsx = convertSvgToJsx(source);
      setJsxCode(jsx);
    } catch (e) {
      console.error(e);
      setError(t.svgToJsxError || 'Failed to convert to JSX');
    }
  };

  const handleCopyJsx = async () => {
    try {
      await navigator.clipboard.writeText(jsxCode);
      setCopiedJsx(true);
      setTimeout(() => setCopiedJsx(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputSvg(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setError(t.svgErrorInvalidFile || 'Please select a valid SVG file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <NavigationButtons levelUp="tools" />

          <div className="flex items-center gap-3 mt-14 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">{t.svgOptimizer || 'SVG Optimizer'}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t.svgOptimizerDesc ||
              'Optimize your SVG code by removing unnecessary attributes, empty groups, and metadata'}
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t.svgUploadLabel || 'Upload SVG File (Optional)'}
          </label>
          <input
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-800 dark:file:text-blue-300"
          />
        </div>

        {/* Input */}
        <div className="mb-6">
          <label htmlFor="svg-input" className="block text-sm font-medium mb-2">
            {t.svgInputLabel || 'SVG Code Input'}
          </label>
          <textarea
            ref={textareaRef}
            id="svg-input"
            value={inputSvg}
            onChange={(e) => setInputSvg(e.target.value)}
            placeholder={t.svgInputPlaceholder || 'Paste your SVG code here...'}
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Optimize Button */}
        <div className="mb-6">
          <button
            onClick={handleOptimize}
            disabled={isProcessing || !inputSvg.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.svgOptimizing || 'Optimizing...'}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {t.svgOptimizeButton || 'Optimize SVG'}
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              {t.svgResultsTitle || 'Optimization Results'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-600 dark:text-green-400">
                  {t.svgOriginalSize || 'Original Size:'}
                </span>
                <div className="font-mono">{stats.originalSize} bytes</div>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400">
                  {t.svgOptimizedSize || 'Optimized Size:'}
                </span>
                <div className="font-mono">{stats.optimizedSize} bytes</div>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400">{t.svgSaved || 'Saved:'}</span>
                <div className="font-mono">{stats.savings} bytes</div>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400">
                  {t.svgReduction || 'Reduction:'}
                </span>
                <div className="font-mono">{stats.savingsPercent.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        {optimizedSvg && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                {t.svgOutputLabel || 'Optimized SVG Code'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.svgCopied || 'Copied!' : t.svgCopy || 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t.svgDownload || 'Download'}
                </button>
              </div>
            </div>
            <textarea
              value={optimizedSvg}
              readOnly
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          </div>
        )}

        {/* Preview */}
        {optimizedSvg && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t.svgPreview || 'Preview'}</label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
              <div
                className="max-w-full max-h-96 overflow-auto"
                dangerouslySetInnerHTML={{ __html: optimizedSvg }}
              />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            {t.svgInfoTitle || 'What gets optimized?'}
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• {t.svgInfoItem1 || 'Removes unnecessary xmlns attributes'}</li>
            <li>• {t.svgInfoItem2 || 'Eliminates empty <g> groups'}</li>
            <li>• {t.svgInfoItem3 || 'Removes <title>, <metadata>, <sodipodi> tags'}</li>
            <li>• {t.svgInfoItem4 || 'Removes <script> tags for security'}</li>
            <li>• {t.svgInfoItem5 || 'Optimizes path data and coordinates'}</li>
            <li>• {t.svgInfoItem6 || 'Removes redundant attributes'}</li>
            <li>• {t.svgInfoItem7 || 'Compresses whitespace and formatting'}</li>
          </ul>
        </div>

        {/* SVG to JSX */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold">{t.svgToJsxTitle || 'Convert SVG to JSX'}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {t.svgToJsxDesc ||
              'Transforms attributes to camelCase and converts inline styles to JSX objects.'}
          </p>
          <button
            onClick={handleConvertToJsx}
            disabled={!inputSvg.trim() && !optimizedSvg.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors mb-3"
          >
            {t.svgToJsxButton || 'Convert to JSX'}
          </button>

          {jsxCode && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  {t.svgJsxOutputLabel || 'JSX Output'}
                </label>
                <button
                  onClick={handleCopyJsx}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {copiedJsx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedJsx ? t.svgJsxCopied || 'Copied!' : t.svgJsxCopy || 'Copy'}
                </button>
              </div>
              <textarea
                value={jsxCode}
                readOnly
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
