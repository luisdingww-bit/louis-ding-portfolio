import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver based scroll-trigger hook.
 * Returns a ref to attach to an element and a boolean that flips to true
 * the first time the element enters the viewport (threshold 0.1), then stops.
 */
export function useInViewAnimation<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
