import { useEffect, useRef, useState } from 'react';

/**
 * Obys.agency-style floating thumbnail preview for the "Selected Works" list.
 * Desktop only (fine pointer). The OS native cursor stays fully visible and
 * performant — we never hide it. This component only renders an image preview
 * that eases in near the pointer when hovering a [data-cursor-image] row.
 *
 * (The old custom pointer ring was removed: a JS-driven cursor always trails
 * the real mouse by at least one frame and felt laggy, so we keep the native
 * cursor and only float a non-interactive preview image behind it.)
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Detect desktop (fine pointer). Mobile keeps the native cursor + no preview.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const thumb = thumbRef.current;
    if (!thumb) return; // safety net

    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let tx = mx;
    let ty = my; // thumbnail (eased, just a preview)

    // Offset the preview down-right of the pointer so the native cursor
    // (and its hotspot) stays clearly visible — we never cover the real arrow.
    const place = (x: number, y: number) =>
      `translate3d(${x + 18}px, ${y + 18}px, 0) translate(-50%, -50%)`;
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

    // Preview eases gently behind the real (native) cursor — the obys feel,
    // without ever replacing the pointer, so responsiveness is unaffected.
    const loop = () => {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      thumb.style.transform = place(tx, ty);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
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
  );
}
