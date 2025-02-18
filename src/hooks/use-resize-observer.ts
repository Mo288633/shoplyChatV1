import { useEffect, useRef } from 'react';

interface ResizeHandler {
  (width: number, height: number): void;
}

export function useResizeObserver(onResize: ResizeHandler) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        onResize(width, height);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [onResize]);

  return ref;
}