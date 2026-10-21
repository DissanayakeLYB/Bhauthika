'use client';

import 'katex/dist/katex.min.css';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface KatexApi {
  renderToString: (
    tex: string,
    options?: {
      displayMode?: boolean;
      throwOnError?: boolean;
      strict?: boolean;
      output?: 'htmlAndMathml' | 'html' | 'mathml';
    },
  ) => string;
}

let katexLoader: Promise<KatexApi & { default?: KatexApi }> | null = null;

/** KaTeX is ~70 kB gzipped; only fetch it when a formula is actually on screen. */
function loadKatex(): Promise<KatexApi & { default?: KatexApi }> {
  katexLoader ??= import('katex') as unknown as Promise<KatexApi & { default?: KatexApi }>;
  return katexLoader;
}

interface FormulaProps {
  /** KaTeX source. */
  latex: string;
  /** Plain-text version shown before KaTeX arrives and if it fails to load. */
  fallback: string;
  /** Block (display) maths by default; inline for prose. */
  display?: boolean;
  className?: string;
}

export function Formula({ latex, fallback, display = true, className }: FormulaProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    void loadKatex()
      .then((module) => {
        const node = ref.current;
        if (cancelled || !node) return;
        const katex = module.default ?? module;
        node.innerHTML = katex.renderToString(latex, {
          displayMode: display,
          throwOnError: false,
          strict: false,
          output: 'htmlAndMathml',
        });
      })
      .catch(() => {
        // Keep the readable fallback formula.
      });

    return () => {
      cancelled = true;
    };
  }, [latex, display]);

  return (
    <span
      ref={ref}
      suppressHydrationWarning
      className={cn('formula block break-words text-ink', className)}
    >
      {fallback}
    </span>
  );
}
