'use client';

import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Clipboard } from 'lucide-react';

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      className="code-copy-button"
      onClick={copyCode}
      aria-label={copied ? 'تم نسخ الكود' : 'نسخ الكود'}
      title={copied ? 'تم النسخ' : 'نسخ الكود'}
    >
      {copied ? <Check size={18} /> : <Clipboard size={18} />}
    </button>
  );
}

export default function CodeBlocks({ html }) {
  const contentRef = useRef(null);

  useEffect(() => {
    const codeBlocks = contentRef.current?.querySelectorAll('pre');
    const roots = [];

    codeBlocks?.forEach((pre) => {
      const buttonContainer = document.createElement('span');
      const root = createRoot(buttonContainer);
      root.render(<CopyButton code={(pre.textContent || '').trimEnd()} />);
      pre.appendChild(buttonContainer);
      roots.push(root);
    });

    return () => roots.forEach((root) => root.unmount());
  }, [html]);

  return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />;
}