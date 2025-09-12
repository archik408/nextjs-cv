'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github-dark-dimmed.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('xml', xml);

type Props = {
  language?: 'javascript' | 'js' | 'typescript' | 'ts' | 'jsx' | 'tsx' | 'xml';
  code: string;
};

export function CodeBlock({ language = 'typescript', code }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        // Remove existing highlight classes and attributes
        ref.current.classList.remove('hljs');
        ref.current.removeAttribute('data-highlighted');

        // Set the text content first
        ref.current.textContent = code;

        // Force re-highlight with a small delay to ensure DOM is updated
        setTimeout(() => {
          if (ref.current) {
            hljs.highlightElement(ref.current);
          }
        }, 0);
      } catch (error) {
        console.warn('Highlight.js error:', error);
        // Fallback: just set the text content
        if (ref.current) {
          ref.current.textContent = code;
        }
      }
    }
  }, [code, language]);

  return (
    <pre className="overflow-auto bg-gray-900 text-gray-100 p-4 rounded-lg">
      <code ref={ref} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
}

export default CodeBlock;
