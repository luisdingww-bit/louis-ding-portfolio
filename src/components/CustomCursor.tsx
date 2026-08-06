import { useEffect, useRef, useState } from 'react';

/**
 * Global custom cursor (desktop only).
 * - A small dot follows the pointer 1:1 (mix-blend-difference for a premium feel).
 * - When hovering an element with [data-cursor-image], a floating thumbnail
 *   preview (plus optional [data-cursor-label]) eases in behind the dot.
 * Disabled on touch / coarse pointers (mobile falls back to the native cursor).
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    setEnabled(true);

    const dot = dotRef.current!;
    const thumb = thumbRef.current!;
    let raf = 0;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      const el = (e.target as HTMLElement | null)?.closest(
        '[data-cursor-image]',
      ) as HTMLElement | null;
      if (el) {
        const src = el.dataset.cursorImage || '';
        const label = el.dataset.cursorLabel || '';
        if (imgRef.current && imgRef.current.src !== src) imgRef.current.src = src;
        if (labelRef.current) labelRef.current.textContent = label;
        if (!activeRef.current) {
          activeRef.current = true;
          setActive(true);
        }
      } else if (activeRef.current) {
        activeRef.current = false;
        setActive(false);
      }
    };

    // Thumbnail trails the pointer with easing for a silky feel.
    const loop = () => {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      thumb.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    const root = document.documentElement;
    root.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      root.style.cursor = '';
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-white mix-blend-difference"
        aria-hidden
      />
      <div
        ref={thumbRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#051A24] shadow-2xl transition-opacity duration-200 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      >
        <img ref={imgRef} alt="" className="h-full w-full object-cover" />
        <span
          ref={labelRef}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.18em] text-white"
        />
      </div>
    </>
  );
}
