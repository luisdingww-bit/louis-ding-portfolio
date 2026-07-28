import { CSSProperties, ReactNode } from 'react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

interface RevealProps {
  children: ReactNode;
  /** Staggered animation delay in seconds */
  delay?: number;
  className?: string;
}

/**
 * Wraps content so it fades + slides up when scrolled into view.
 * Applies `animate-fade-in-up` once the element intersects, otherwise stays `opacity-0`.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, inView } = useInViewAnimation<HTMLDivElement>();
  const style: CSSProperties = { animationDelay: `${delay}s` };
  const cls = inView ? 'animate-fade-in-up' : 'opacity-0';

  return (
    <div ref={ref} className={`${cls} ${className}`} style={style}>
      {children}
    </div>
  );
}
