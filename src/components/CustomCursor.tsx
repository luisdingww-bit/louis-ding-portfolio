import { useEffect, useRef, useState } from 'react';

/**
 * Global custom cursor (desktop only).
 * - A small ring follows the pointer 1:1 (mix-blend-difference so it stays
 *   visible on any background — light or dark).
 * - When hovering an element with [data-cursor-image], a floating thumbnail
 *   preview (plus optional [data-cursor-label]) eases in behind the ring —
 *   the signature obys.agency interaction.
 * Disabled on touch / coarse pointers (mobile keeps the native cursor).
 * z-index is above the intro overlay so the cursor is never hidden.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Desktop (fine pointer) only; otherwise keep the native cursor.
    if (!window.matchMedia('(pointer:fine)').matches) return;
    setEnabled(true);

    const ring = ringRef.current!;
    const thumb = thumbRef.current!;
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my; // ring (near-instant)
    let tx = mx;
    let ty = my; // thumb (eased)

    const place = (x: number, y: number) =>
      `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    ring.style.transform = place(rx, ry);
    thumb.style.transform = place(tx, ty);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
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

    // Ring tracks tightly; thumbnail trails with easing for a silky feel.
    const loop = () => {
      rx += (mx - rx) * 0.35;
      ry += (my - ry) * 0.35;
      ring.style.transform = place(rx, ry);
      tx += (mx - tx) * 0.14;
      ty += (my - ty) * 0.14;
      thumb.style.transform = place(tx, ty);
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
      {/* Default ring cursor — always visible on desktop, any background */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[10001] flex h-9 w-9 items-center justify-center rounded-full border-2 border-white mix-blend-difference transition-[transform,opacity] duration-200 ${
          active ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-hidden
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>

      {/* Floating thumbnail (obys-style) — appears on work hover */}
      <div
        ref={thumbRef}
        className={`pointer-events-none fixed left-0 top-0 z-[10000] flex h-32 w-44 items-center justify-center overflow-hidden rounded-2xl bg-[#051A24] shadow-2xl transition-opacity duration-200 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      >
        <img ref={imgRef} alt="" className="h-full w-full object-cover" />
        <span
          ref={labelRef}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.18em] text-white"
        />
      </div>
    </>
  );
}
