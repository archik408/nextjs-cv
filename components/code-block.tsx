'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/github-dark.min.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);

type Props = {
  language?: 'javascript' | 'js' | 'typescript' | 'ts';
  code: string;
};

export function CodeBlock({ language = 'typescript', code }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        hljs.highlightElement(ref.current);
      } catch {}
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
