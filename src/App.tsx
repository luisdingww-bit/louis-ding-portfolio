import { useState } from 'react';
import Button from './components/Button';
import Reveal from './components/Reveal';
import TopNav from './components/TopNav';
import TestimonialSection from './components/TestimonialSection';
import ExpertiseSection from './components/ExpertiseSection';
import ProjectsSection from './components/ProjectsSection';
import PartnerSection from './components/PartnerSection';
import Footer from './components/Footer';
import CopyrightBar from './components/CopyrightBar';
import BottomNav from './components/BottomNav';
import BlogView from './components/BlogView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import { marqueeImages, whatsappUrl } from './constants';

/* ---------- EVR-style Hero with 3D glass cube + light rays ---------- */
function Hero() {
  const [rot, setRot] = useState({ x: -18, y: 26 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setRot({
      x: ((e.clientY - r.top) / r.height - 0.5) * -28,
      y: ((e.clientX - r.left) / r.width - 0.5) * 28,
    });
  }

  return (
    <section
      id="top"
      onMouseMove={handleMove}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#06070c',
        color: '#eef1f8',
      }}
    >
      {/* Light rays */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: '-20%',
          background: `
            conic-gradient(from 210deg at 55% 42%,
              transparent 0deg,
              rgba(33,212,253,.22) 30deg,
              transparent 65deg,
              transparent 90deg,
              rgba(124,92,255,.20) 130deg,
              transparent 170deg,
              transparent 200deg,
              rgba(255,220,80,.15) 250deg,
              transparent 300deg,
              transparent 360deg
            )
          `,
          filter: 'blur(36px)',
          animation: 'raySpin 14s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 65% 55% at 58% 38%, rgba(124,92,255,.16), transparent 70%),
            radial-gradient(ellipse 45% 35% at 32% 68%, rgba(33,212,253,.12), transparent 65%),
            radial-gradient(ellipse 55% 48% at 72% 78%, rgba(255,92,171,.09), transparent 70%)
          `,
        }} />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 75% 55% at 50% 35%, #000 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 35%, #000 20%, transparent 75%)',
      }} />

      {/* Content + Cube */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '120px 6% 80px', maxWidth: '1160px', margin: '0 auto',
        gap: '40px',
      }}>
        {/* Left text */}
        <div style={{ maxWidth: '480px' }}>
          <Reveal delay={0.1} style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block', fontSize: '13px', fontWeight: 600,
              letterSpacing: '.14em', textTransform: 'uppercase', color: '#21d4fd',
              border: '1px solid rgba(33,212,253,.3)', borderRadius: '999px',
              padding: '6px 14px', background: 'rgba(33,212,253,.08)',
            }}>
              Architecture × AI × Digital Fabrication
            </span>
          </Reveal>

          <Reveal delay={0.2} style={{ marginBottom: '8px' }}>
            <span className="font-mondwest" style={{ display: 'block', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.02em' }}>
              LD
            </span>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{
              fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.08,
              letterSpacing: '-0.03em', marginTop: '8px', marginBottom: '20px',
            }}>
              Build the{' '}
              <span className="font-mondwest" style={{
                background: 'linear-gradient(110deg, #7c5cff, #21d4fd, #ff5cab)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>next wave</span>,
              <br />the{' '}
              <span className="font-mondwest" style={{
                background: 'linear-gradient(110deg, #7c5cff, #21d4fd, #ff5cab)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>bold way</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#9aa3b8' }}>
                我是一名建筑专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#9aa3b8' }}>
                正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#9aa3b8' }}>目前研究合作、实习与设计项目机会。</p>
            </div>
          </Reveal>

          <Reveal delay={0.5} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="primary" href={whatsappUrl}>Start a chat</Button>
            <Button variant="secondary" href="#projects" style={{
              borderColor: 'rgba(255,255,255,.15)', color: '#eef1f8', background: 'rgba(255,255,255,.06)'
            }}>View projects</Button>
          </Reveal>
        </div>

        {/* Right — 3D Glass Cube */}
        <div style={{
          perspective: '900px', width: '340px', height: '340px',
          minWidth: '280px', flexShrink: 0,
        }}>
          <div style={{
            width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transition: 'transform .12s ease-out',
            position: 'relative',
          }}>
            {/* Cube faces — glass effect */}
            {[
              { t: 'translateZ(140px)' },
              { t: 'rotateY(180deg) translateZ(140px)' },
              { t: 'rotateY(-90deg) translateZ(140px)' },
              { t: 'rotateY(90deg) translateZ(140px)' },
              { t: 'rotateX(90deg) translateZ(140px)' },
              { t: 'rotateX(-90deg) translateZ(140px)' },
            ].map((f, i) => (
              <div key={i} style={{
                position: 'absolute', inset: 0,
                transform: f.t as string,
                border: '1px solid rgba(180,200,255,.22)',
                borderRadius: '14px',
                background: i === 0 || i === 1
                  ? 'linear-gradient(135deg, rgba(124,92,255,.12), rgba(33,212,253,.08), rgba(255,92,171,.06))'
                  : 'linear-gradient(135deg, rgba(33,212,253,.08), rgba(124,92,255,.06))',
                backdropFilter: 'blur(6px)',
                boxShadow: i === 0
                  ? 'inset 0 0 40px rgba(255,255,255,.08), 0 0 60px rgba(124,92,255,.25)'
                  : 'inset 0 0 30px rgba(255,255,255,.05)',
              }} />
            ))}
            {/* Inner glow core */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '60px', height: '60px', borderRadius: '50%',
              transform: 'translate(-50%, -50%) translateZ(0)',
              background: 'radial-gradient(circle, rgba(124,92,255,.5), rgba(33,212,253,.3), transparent 70%)',
              filter: 'blur(12px)',
              boxShadow: '0 0 80px rgba(124,92,255,.4), 0 0 120px rgba(33,212,253,.2)',
            }} />
            {/* Edge highlights */}
            {[0, 90, 180, 270].map((a) => (
              <div key={`eh-${a}`} style={{
                position: 'absolute', top: '50%', left: '50%', width: '260px', height: '2px',
                background: `linear-gradient(90deg, transparent, rgba(180,200,255,.35), transparent)`,
                transformOrigin: 'center',
                transform: `translate(-50%, -50%) rotateZ(${a}deg) rotateX(${a % 180 === 0 ? 90 : 0}deg)`,
                borderRadius: '1px',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, textAlign: 'center', opacity: .5,
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Scroll</div>
        <div style={{
          width: '1px', height: '32px', margin: '0 auto',
          background: 'linear-gradient(to bottom, rgba(255,255,255,.6), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* Injected keyframes via style tag if not already present */}
      <style>{`
        @keyframes raySpin {
          0% { transform: translate3d(-2%, -1%, 0) scale(1); }
          100% { transform: translate3d(3%, 2%, 0) scale(1.08); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: .3; transform: scaleY(.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

function Marquee() {
  const loop = [...marqueeImages, ...marqueeImages];
  return (
    <section id="gallery" className="mb-16 mt-16 scroll-mt-20 overflow-hidden md:mt-20">
      <div className="flex w-max animate-marquee">
        {loop.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden
            className="mx-3 h-[280px] w-auto rounded-2xl object-cover shadow-lg md:h-[500px]"
          />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'about' | 'gallery' | 'blog'>('home');

  function goAbout() {
    window.scrollTo(0, 0);
    setView('about');
  }
  function goBlog() {
    window.scrollTo(0, 0);
    setView('blog');
  }
  function goGallery() {
    window.scrollTo(0, 0);
    setView('gallery');
  }
  function goHome() {
    window.scrollTo(0, 0);
    setView('home');
  }

  return (
    <main className="min-h-screen bg-white">
      <TopNav onHome={goHome} onAbout={goAbout} onGallery={goGallery} onBlog={goBlog} />
      {view === 'home' ? (
        <>
          <Hero />
          <Marquee />
          <TestimonialSection />
          <ExpertiseSection />
          <ProjectsSection />
          <PartnerSection />
          <Footer />
          <CopyrightBar />
          <BottomNav />
        </>
      ) : view === 'about' ? (
        <AboutView onBack={goHome} />
      ) : view === 'gallery' ? (
        <GalleryView onBack={goHome} />
      ) : (
        <BlogView onBack={goHome} />
      )}
    </main>
  );
}
