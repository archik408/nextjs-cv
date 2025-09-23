import hljs from 'highlight.js';
import { marked } from 'marked';

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
