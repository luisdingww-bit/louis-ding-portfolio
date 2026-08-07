import { useEffect, useRef, useState } from 'react';
import { LANDMARKS } from './landmarks';

/**
 * Opening HUD moment (desktop only, mounted by App).
 * Theme: "Architecture × AI × Digital Fabrication".
 *
 * Replaced the old 3D GLB model viewer with a hand-drawn SVG landmark
 * gallery rendered inside a sci-fi HUD frame:
 *   - corner brackets, center reticle, scanlines + vignette
 *   - a scan-line sweeps top→bottom to "reveal" each landmark (clip-path)
 *   - landmarks cycle with a restrained cross-fade / scan transition
 *   - mouse-move gives a gentle parallax tilt
 *   - LEFT click anywhere ENTERs the site
 *
 * No WebGL dependency — pure SVG/DOM, so the intro chunk is tiny.
 */

const REVEAL = 1.6; // seconds for the scan reveal
const CYCLE = 4.8; // seconds per landmark (reveal + hold)

export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);
  const [index, setIndex] = useState(0);
  const [titleIn, setTitleIn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleIn(true);
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LANDMARKS.length);
    }, CYCLE * 1000);
    return () => window.clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    setTilt({ x: -ny * 7, y: nx * 10 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const enter = () => {
    setHide(true);
    window.setTimeout(onDone, 520);
  };

  const lm = LANDMARKS[index];
  const Ill = lm.Illustration;

  return (
    <div
      ref={wrapRef}
      onClick={enter}
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      onContextMenu={(e) => e.preventDefault()}
      className={`fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center bg-[#051A24] transition-opacity duration-700 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes scanReveal{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0% 0)}}
        @keyframes scanBar{0%{top:5%;opacity:0}12%{opacity:1}88%{opacity:1}100%{top:95%;opacity:0}}
        @keyframes nameIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes scanline{from{background-position:0 0}to{background-position:0 6px}}
      `}</style>

      {/* ---------- HUD overlays (non-interactive) ---------- */}
      {/* scanlines + vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'overlay',
          animation: 'scanline 0.6s linear infinite',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 52%, rgba(2,10,14,0.78) 100%)',
        }}
      />

      {/* corner brackets */}
      {[
        'left-5 top-5 border-l-2 border-t-2',
        'right-5 top-5 border-r-2 border-t-2',
        'left-5 bottom-5 border-l-2 border-b-2',
        'right-5 bottom-5 border-r-2 border-b-2',
      ].map((c) => (
        <div key={c} className={`pointer-events-none absolute h-8 w-8 border-[#E8B04B] ${c}`} />
      ))}

      {/* center reticle */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 opacity-40">
        <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-[#7fe3ff]" />
        <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-[#7fe3ff]" />
        <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-[#7fe3ff]" />
        <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-[#7fe3ff]" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7fe3ff]" />
      </div>

      {/* top-left theme label */}
      <span
        className={`pointer-events-none absolute left-7 top-8 text-[10px] font-medium uppercase tracking-[0.28em] text-[#E8B04B] transition-opacity duration-1000 ${
          titleIn ? 'opacity-90' : 'opacity-0'
        }`}
      >
        Architecture × AI × Digital Fabrication
      </span>

      {/* top-right coordinate readout */}
      <div className="pointer-events-none absolute right-7 top-8 text-right font-mono text-[10px] leading-relaxed tracking-wider text-[#7fe3ff]/80">
        <div>LAT {lm.lat}°</div>
        <div>LON {lm.lon}°</div>
        <div className="text-white/40">TARGET: {lm.en.toUpperCase()}</div>
      </div>

      {/* ---------- stage with parallax tilt ---------- */}
      <div style={{ perspective: '1200px' }} className="w-[86vw] max-w-[860px]">
        <div
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.25s ease-out',
            animation: 'floatY 7s ease-in-out infinite',
          }}
          className="relative mx-auto aspect-[600/420] w-full"
        >
          {/* scan-reveal wrapper — remounts per landmark to replay animation */}
          <div
            key={index}
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: 'inset(0 0 0% 0)', animation: `scanReveal ${REVEAL}s ease forwards` }}
          >
            <Ill />
            {/* moving scan bar */}
            <div
              className="absolute left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #7fe3ff, transparent)',
                boxShadow: '0 0 12px 2px rgba(127,227,255,0.8)',
                animation: `scanBar ${REVEAL}s ease forwards`,
              }}
            />
          </div>
          {/* framing border */}
          <div className="pointer-events-none absolute inset-0 border border-[#7fe3ff]/20" />
        </div>
      </div>

      {/* SCANNING label near bottom of frame */}
      <span className="pointer-events-none absolute bottom-[26%] left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#7fe3ff]/70">
        ◍ Scanning…
      </span>

      {/* current landmark name — fades in on each switch */}
      <span
        key={`name-${index}`}
        className="pointer-events-none absolute bottom-[16%] left-1/2 text-center"
        style={{ animation: 'nameIn .7s ease both' }}
      >
        <span className="block text-lg font-semibold tracking-wide text-white sm:text-xl">
          {lm.name}
        </span>
        <span className="block text-[11px] uppercase tracking-[0.22em] text-white/55">
          {lm.location}
        </span>
      </span>

      {/* click to enter */}
      <span className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.25em] text-white/60">
        左键点击进入 · 移动鼠标视差
      </span>
    </div>
  );
}
