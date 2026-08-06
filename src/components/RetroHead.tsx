import { useEffect, useRef, useState } from 'react';
import { useI18n, type Lang } from '../i18n';

/**
 * SnapPrint showcase card — mirrors the mainframe-hero.surge.sh landing layout.
 *
 * Dark container | left: title + desc + feature pills + CTA
 *                | right: retro-head.mp4 video + interactive eye-tracking overlay
 *                | top: SVG grain / scanline filter
 */
export default function SnapPrintShowcase() {
  const { lang, t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function move(e: MouseEvent) {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      // eye area center (right side of the card)
      const cx = r.left + r.width * 0.72; // ~where the head sits
      const cy = r.top + r.height * 0.42;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
      const max = 10;
      setEyePos({ x: Math.cos(ang) * max, y: Math.sin(ang) * max });
    }
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const features: { label: Record<Lang, string>; tone: 'muted' | 'accent' | 'warm' }[] = [
    { label: { zh: '照片浮雕 · 灰度高保真', en: 'Photo Relief · High-fidelity Grayscale' }, tone: 'muted' },
    { label: { zh: '2D 轮廓拉伸 · Logo 变 3D', en: '2D Contour Extrusion · Logo to 3D' }, tone: 'muted' },
    { label: { zh: '真实 3D 几何 · 单图重建', en: 'True 3D Geometry · Single-image Reconstruction' }, tone: 'accent' },
    { label: { zh: '3COGS 高斯泼溅 · spike 导出', en: '3COGS Gaussian Splatting · spike Export' }, tone: 'accent' },
    { label: { zh: '模型库：33 款内置原创模型 · Apache-2.0', en: 'Model Library: 33 Built-in Models · Apache-2.0' }, tone: 'warm' },
  ];

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#0c0e14',
        color: '#e8eaef',
        minHeight: 480,
      }}
    >
      {/* ── grain / noise overlay ── */}
      <svg
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', opacity: 0.13, mixBlendMode: 'overlay',
        }}
        aria-hidden
      >
        <filter id="sp-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sp-grain)" />
      </svg>

      {/* ── scanlines ── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(rgba(255,255,255,.03) 0 1px, transparent 1px 3px)',
        }}
      />

      {/* ── content grid ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '48px 6%', position: 'relative', zIndex: 1 }}>
        {/* LEFT — text */}
        <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, letterSpacing: 0.5 }}>
            <span>SnapPrint</span>
            <span style={{ color: '#d4a855' }}>®</span>
            <span>咔印3D</span>
            <span style={{ fontSize: 16 }}>✨</span>
          </div>

          {/* headline */}
          <p style={{ fontSize: 17, lineHeight: 1.7, color: '#c8cad0', maxWidth: 420 }}>
            {t('snapprint.headline')}
          </p>

          {/* feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {features.map((f) => (
              <span
                key={f.label[lang]}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor:
                    f.tone === 'accent' ? '#3a7a9e66' :
                    f.tone === 'warm' ? '#b8964444' :
                    '#ffffff22',
                  background:
                    f.tone === 'accent' ? '#0e3a5533' :
                    f.tone === 'warm' ? '#3d320f22' :
                    '#ffffff0a',
                  color: f.tone === 'accent' ? '#6ec4e8' : f.tone === 'warm' ? '#e0c87a' : '#a8aab2',
                }}
              >
                {f.label[lang]}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://snapprint.surge.sh/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              padding: '10px 24px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              background: 'linear-gradient(135deg,#d4a855,#c49330)',
              color: '#0c0e14',
              textDecoration: 'none',
              width: 'fit-content',
              boxShadow: '0 2px 12px rgba(212,168,85,.25)',
            }}
          >
            {t('snapprint.cta')} <span aria-hidden>↗</span>
          </a>
        </div>

        {/* RIGHT — CRT head video + eye overlay */}
        <div style={{ flex: '1', position: 'relative', minWidth: 0 }}>
          <video
            autoPlay muted loop playsInline preload="auto"
            src={`${import.meta.env.BASE_URL}retro-head.mp4`}
            style={{
              width: '100%',
              borderRadius: 12,
              display: 'block',
              objectFit: 'cover',
              objectPosition: '70% center',
              aspectRatio: '4/3',
            }}
          />

          {/* interactive eye glow overlay — follows cursor */}
          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '58%',
              width: '28%',
              height: '22%',
              pointerEvents: 'none',
              transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
              transition: 'transform .08s ease-out',
            }}
          >
            {/* soft radial glow where eyes are */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 45% 55% at 30% 50%, rgba(230,240,255,.35), transparent 60%), radial-gradient(ellipse 45% 55% at 72% 50%, rgba(230,240,255,.35), transparent 60%)',
                borderRadius: 8,
                mixBlendMode: 'screen',
                filter: 'blur(6px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* bottom scroll hint */}
      <div style={{
        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        fontSize: 10, letterSpacing: 3, color: '#fff44', zIndex: 1,
      }}>
        SCROLL <span style={{ display: 'block', margin: '3px auto 0', width: 1, height: 14, background: '#fff33', borderRadius: 1 }} />
      </div>
    </div>
  );
}
