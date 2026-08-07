import { useCallback, useEffect, useRef, useState } from 'react';
import { landmarks, type Landmark } from './landmarks';

/* ─── Easing ─── */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/* ─── Annotation Label Component ─── */
function AnnotationLabel({
  annotation,
  visible,
}: {
  annotation: Landmark['annotations'][0];
  visible: boolean;
}) {
  const posClass = {
    'top-left': 'top-[8%] left-[4%]',
    'top-right': 'top-[8%] right-[4%] text-right',
    'bottom-left': 'bottom-[14%] left-[4%]',
    'bottom-right': 'bottom-[14%] right-[4%] text-right',
    'mid-left': 'top-[45%] left-[3%]',
    'mid-right': 'top-[45%] right-[3%] text-right',
  }[annotation.position];

  return (
    <div
      className={`absolute ${posClass} max-w-[180px] transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {/* Leader line dot */}
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-400/70 align-middle mr-1.5" />
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-stone-500 leading-tight block">
        {annotation.text}
      </span>
      {annotation.sub && (
        <span className="font-serif italic text-[10px] text-stone-400/80 leading-snug mt-0.5 block whitespace-pre-line">
          {annotation.sub}
        </span>
      )}
    </div>
  );
}

/* ─── Geometric HUD Overlay ─── */
function HUDOverlay({ scanProgress }: { scanProgress: number }) {
  return (
    <>
      {/* Top-center crosshair + circle */}
      <svg className="absolute top-[5%] left-1/2 -translate-x-1/2 w-28 h-28 pointer-events-none" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r="40" fill="none" stroke="#a8a29e" strokeWidth="0.4" opacity="0.3" strokeDasharray="3 4" />
        <circle cx="56" cy="56" r="24" fill="none" stroke="#a8a29e" strokeWidth="0.4" opacity="0.25" />
        <line x1="56" y1="0" x2="56" y2="112" stroke="#a8a29e" strokeWidth="0.35" opacity="0.15" strokeDasharray="2 6" />
        <line x1="0" y1="56" x2="112" y2="56" stroke="#a8a29e" strokeWidth="0.35" opacity="0.15" strokeDasharray="2 6" />
        <circle cx="56" cy="56" r="2.5" fill="none" stroke="#78716c" strokeWidth="0.6" opacity="0.5" />
        <circle cx="56" cy="56" r="1" fill="#78716c" opacity="0.6" />
      </svg>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-stone-400/30" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-stone-400/30" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-stone-400/30" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-stone-400/30" />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-20"
        style={{ top: `${scanProgress * 100}%` }}
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.4)]" />
        <div className="h-16 w-full bg-gradient-to-b from-amber-300/[0.07] to-transparent blur-sm" />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(87,83,78,0.08) 100%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,113,108,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(120,113,108,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Coordinate readout — top right */}
      <div className="absolute top-5 right-7 font-mono text-[8px] tracking-widest text-stone-400/60 space-y-0.5">
        <div>LAT <span className="text-stone-500/80">39.9163</span></div>
        <div>LON <span className="text-stone-500/80">116.397</span></div>
      </div>
    </>
  );
}

/* ─── Main Intro Component ─── */
export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'viewing' | 'exiting'>('scanning');
  const [scanPct, setScanPct] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hide, setHide] = useState(false);
  const startTs = useRef<number>(0);
  const viewTs = useRef<number>(0);
  const animFrame = useRef<number>(0);

  const lm = landmarks[idx];
  const nextIdx = (idx + 1) % landmarks.length;

  /* Scan animation loop */
  useEffect(() => {
    startTs.current = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - startTs.current) / 1000;
      if (phase === 'scanning') {
        // Scan sweeps top→bottom over ~2s
        const p = Math.min(elapsed / 2, 1);
        setScanPct(easeInOutQuad(p));
        if (p >= 1 && !showAnnotations) {
          setShowAnnotations(true);
          setTimeout(() => setPhase('viewing'), 200);
        }
      }
      if (phase === 'viewing') {
        // Auto-advance after viewing period
        if (!viewTs.current) viewTs.current = now;
        const viewElapsed = (now - viewTs.current) / 1000;
        if (viewElapsed > 5.5) {
          // Transition to next landmark
          setShowAnnotations(false);
          setScanPct(0);
          viewTs.current = 0;
          setPhase('scanning');
          setIdx(nextIdx);
        }
      }
      animFrame.current = requestAnimationFrame(tick);
    };
    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, [phase, idx, showAnnotations, nextIdx]);

  /* Mouse parallax */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouse({ x, y });
  }, []);

  /* Click to enter */
  const enter = useCallback(() => {
    setPhase('exiting');
    setHide(true);
    setTimeout(onDone, 700);
  }, [onDone]);

  /* Parallax transform values */
  const rotX = mouse.y * -3;   // degrees
  const rotY = mouse.x * 3;
  const tx = mouse.x * 12;     // px
  const ty = mouse.y * 8;

  /* Clip-path for scan reveal */
  const clipPath = phase === 'scanning' || phase === 'viewing'
    ? `inset(${(1 - easeOutCubic(Math.min(scanPct * 1.3, 1))) * 100}% 0 0 0)`
    : 'inset(0 0 0 0)';

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={enter}
      className={`fixed inset-0 z-[10000] cursor-pointer select-none overflow-hidden bg-[#f5f0e8] transition-opacity duration-700 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── Watermark text (large serif behind everything) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ perspective: '800px' }}
      >
        <div
          className="transition-transform duration-200 ease-out will-change-transform"
          style={{
            transform: `rotateX(${rotX * 0.3}deg) rotateY(${rotY * 0.3}deg)`,
          }}
        >
          <span
            className="font-serif font-bold tracking-wider text-stone-200/60 select-none leading-none whitespace-nowrap"
            style={{
              fontSize: 'clamp(100px, 18vw, 280px)',
              userSelect: 'none',
              WebkitUserSelect: 'none' as const,
            }}
          >
            {lm.watermark}
          </span>
        </div>
      </div>

      {/* ── Building image with parallax & scan reveal ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: '1000px', clipPath }}
      >
        <div
          className="relative transition-transform duration-150 ease-out will-change-transform"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateX(${tx}px) translateY(${ty}px)`,
            maxWidth: '82vw',
            maxHeight: '72vh',
          }}
        >
          {/* Building render */}
          <img
            src={lm.img}
            alt={lm.name}
            className="w-auto max-h-[68vh] object-contain drop-shadow-[0_20px_60px_rgba(63,59,54,0.12)]"
            draggable={false}
            style={{ filter: 'contrast(1.02) saturate(0.94)' }}
          />

          {/* Soft gradient overlays for depth matching */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#f5f0e8]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-[#f5f0e8]/20 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── Annotations ── */}
      {lm.annotations.map((ann, i) => (
        <AnnotationLabel key={`${lm.id}-ann-${i}`} annotation={ann} visible={showAnnotations} />
      ))}

      {/* ── HUD geometric overlay ── */}
      <HUDOverlay scanProgress={scanPct} />

      {/* ── Bottom title bar ── */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 ${
          showAnnotations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="block w-10 h-px bg-stone-300/50" />
          <span className="w-1 h-1 rotate-45 border border-stone-400/50" />
          <span className="block w-10 h-px bg-stone-300/50" />
        </div>
        {/* Title */}
        <h2
          className="font-serif text-sm md:text-base tracking-[0.25em] text-stone-600/90 uppercase"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" }}
        >
          {lm.title}
        </h2>
        <p className="font-mono text-[9px] tracking-[0.3em] text-stone-400/70 mt-1 uppercase">
          {lm.location} · est. {lm.year}
        </p>
      </div>

      {/* ── Landmark counter dots ── */}
      <div className="absolute bottom-6 right-7 flex gap-1.5">
        {landmarks.map((_, i) => (
          <span
            key={i}
            className={`w-1 h-1 rounded-full transition-all duration-500 ${
              i === idx
                ? 'bg-stone-500 scale-125'
                : i === nextIdx
                  ? 'bg-stone-300/60 scale-110'
                  : 'bg-stone-200/40'
            }`}
          />
        ))}
      </div>

      {/* ── Scanning indicator (top-left of center area) ── */}
      <div
        className={`absolute top-[14%] left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.35em] uppercase transition-opacity duration-700 ${
          phase === 'scanning' ? 'opacity-70' : 'opacity-0'
        }`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-pulse mr-2 align-middle" />
        <span className="text-stone-500">Scanning…</span>
      </div>

      {/* ── Click-to-enter hint ── */}
      <div
        className={`absolute bottom-6 left-7 transition-opacity duration-700 ${
          showAnnotations ? 'opacity-60' : 'opacity-0'
        }`}
      >
        <span className="pointer-events-none font-mono text-[9px] uppercase tracking-[0.25em] text-stone-400/80">
          ◍ Click anywhere to enter
        </span>
      </div>
    </div>
  );
}
