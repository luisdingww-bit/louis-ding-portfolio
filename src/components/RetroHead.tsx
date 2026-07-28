import { useEffect, useRef } from 'react';

/**
 * Interactive CRT "computer head" — the eyes follow the mouse cursor
 * (wherever the pointer goes, the head looks there), with a pink glow
 * and an SVG grain / scanline filter (matching the SnapPrint landing page vibe).
 */
export default function RetroHead() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lPupil = useRef<SVGGElement>(null);
  const rPupil = useRef<SVGGElement>(null);

  useEffect(() => {
    function move(e: MouseEvent) {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
      const max = 9; // px the pupils can travel
      const gx = Math.cos(ang) * max;
      const gy = Math.sin(ang) * max;
      lPupil.current?.setAttribute('transform', `translate(${gx} ${gy})`);
      rPupil.current?.setAttribute('transform', `translate(${gx} ${gy})`);
    }
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#080a10',
        aspectRatio: '16 / 9',
      }}
    >
      {/* soft pink glow behind the head */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 60% at 50% 45%, rgba(255,46,154,.20), transparent 70%)',
        }}
      />

      {/* the CRT head */}
      <svg
        viewBox="0 0 400 225"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden
      >
        <defs>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd0ec" />
            <stop offset="45%" stopColor="#ff2e9a" />
            <stop offset="100%" stopColor="#7a0f48" />
          </radialGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* monitor body */}
        <rect x="118" y="34" width="164" height="138" rx="20" fill="#0e1422" stroke="#22304a" strokeWidth="2" />
        {/* screen */}
        <rect x="134" y="50" width="132" height="106" rx="12" fill="#04060c" />

        {/* glowing eyes */}
        <g filter="url(#soft)">
          <circle cx="174" cy="98" r="17" fill="url(#eyeGlow)" />
          <circle cx="226" cy="98" r="17" fill="url(#eyeGlow)" />
        </g>

        {/* pupils — these move with the cursor */}
        <g ref={lPupil}>
          <circle cx="174" cy="98" r="7.5" fill="#0a0c14" />
          <circle cx="177" cy="95" r="2.4" fill="#ffd9f0" />
        </g>
        <g ref={rPupil}>
          <circle cx="226" cy="98" r="7.5" fill="#0a0c14" />
          <circle cx="229" cy="95" r="2.4" fill="#ffd9f0" />
        </g>

        {/* mouth */}
        <path
          d="M186 124 Q200 134 214 124"
          stroke="#ff5cab"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity=".85"
        />
      </svg>

      {/* CRT scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(rgba(255,255,255,.05) 0 1px, transparent 1px 3px)',
        }}
      />

      {/* SVG grain / noise filter (matching SnapPrint landing page) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.12,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
