// Use Node-safe core build to avoid accessing document during SSR
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import markdownLang from 'highlight.js/lib/languages/markdown';
import { marked } from 'marked';

// Register a minimal set of languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('markdown', markdownLang);

// Configure marked once per process
// Renderer compatible with marked v15 token shape
const renderer = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ text, lang }: any) {
    const language = (lang || '').trim().split(/\s+/)[0];
    let highlighted = '';
    try {
      if (language) {
        highlighted = hljs.highlight(text, { language }).value;
      } else {
        highlighted = hljs.highlightAuto(text).value;
      }
    } catch {
      highlighted = text;
    }
    const classAttr = language ? `hljs language-${language}` : 'hljs';
    return `<pre><code class=\"${classAttr}\">${highlighted}</code></pre>`;
  },
};

marked.setOptions({
  breaks: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  headerIds: true,
  headerPrefix: 'h-',
});
marked.use({ renderer });

export function renderMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string;
}
