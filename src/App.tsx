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

/* ---------- Clean light intro (no video, no gradient effects) ---------- */
function Hero() {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        background: '#fafbfc',
        color: '#051A24',
      }}
    >
      <div style={{
        maxWidth: '1160px', width: '100%', margin: '0 auto',
        padding: '110px 6% 70px',
      }}>
        <Reveal delay={0.1} style={{ marginBottom: '12px' }}>
          <span style={{
            display: 'inline-block', fontSize: '13px', fontWeight: 600,
            letterSpacing: '.14em', textTransform: 'uppercase', color: '#5b6b7a',
            border: '1px solid rgba(5,26,36,.18)', borderRadius: '999px',
            padding: '6px 14px', background: 'rgba(5,26,36,.04)',
          }}>
            Architecture × AI × Digital Fabrication
          </span>
        </Reveal>

        <Reveal delay={0.2} style={{ marginBottom: '8px' }}>
          <span className="font-mondwest" style={{
            display: 'block', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700,
            lineHeight: 1.06, letterSpacing: '-0.02em', color: '#051A24',
          }}>
            LD
          </span>
        </Reveal>

        <Reveal delay={0.3}>
          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.03em', marginTop: '8px', marginBottom: '20px',
            color: '#051A24',
          }}>
            Build the next wave,<br />the bold way.
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px',
            marginBottom: '28px', maxWidth: '560px',
          }}>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#44525f' }}>
              我是一名建筑专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#44525f' }}>
              正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#44525f' }}>目前研究合作、实习与设计项目机会。</p>
          </div>
        </Reveal>

        <Reveal delay={0.5} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary" href={whatsappUrl}>Start a chat</Button>
          <Button variant="secondary" href="#projects">View projects</Button>
        </Reveal>
      </div>
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
