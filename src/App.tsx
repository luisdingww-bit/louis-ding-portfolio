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

/* ---------- Dark hero with retro computer head VIDEO ---------- */
function Hero() {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#080a10',
        color: '#eef1f8',
      }}
    >
      {/* Background video — retro computer head */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: '70% center', zIndex: 0,
        }}
        src={import.meta.env.BASE_URL + 'retro-head.mp4'}
      />

      {/* Dark veil over video for text readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(8,10,16,.82) 0%, rgba(8,10,16,.45) 50%, rgba(8,10,16,.7) 100%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Subtle grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 70% 55% at 48% 38%, #000 15%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 48% 38%, #000 15%, transparent 75%)',
      }} />

      {/* Content layout */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '110px 6% 70px', maxWidth: '1160px', margin: '0 auto',
        gap: '48px',
      }}>
        {/* Left text */}
        <div style={{ maxWidth: '500px' }}>
          <Reveal delay={0.1} style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block', fontSize: '13px', fontWeight: 600,
              letterSpacing: '.14em', textTransform: 'uppercase', color: '#22d3ee',
              border: '1px solid rgba(34,211,238,.28)', borderRadius: '999px',
              padding: '6px 14px', background: 'rgba(34,211,238,.07)',
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
              fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.08,
              letterSpacing: '-0.03em', marginTop: '8px', marginBottom: '20px',
            }}>
              Build the{' '}
              <span className="font-mondwest" style={{
                background: 'linear-gradient(110deg, #22d3ee, #7c5cff, #ff5cab)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>next wave</span>,
              <br />the{' '}
              <span className="font-mondwest" style={{
                background: 'linear-gradient(110deg, #22d3ee, #7c5cff, #ff5cab)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>bold way</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#94a3b8' }}>
                我是一名建筑专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#94a3b8' }}>
                正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#94a3b8' }}>目前研究合作、实习与设计项目机会。</p>
            </div>
          </Reveal>

          <Reveal delay={0.5} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="primary" href={whatsappUrl}>Start a chat</Button>
            <Button variant="secondary" href="#projects" style={{
              borderColor: 'rgba(255,255,255,.15)', color: '#eef1f8', background: 'rgba(255,255,255,.05)'
            }}>View projects</Button>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 3, textAlign: 'center', opacity: .5,
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Scroll</div>
        <div style={{
          width: '1px', height: '32px', margin: '0 auto',
          background: 'linear-gradient(to bottom, rgba(255,255,255,.6), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* Keyframes */}
      <style>{`
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
