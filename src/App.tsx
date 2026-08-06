import { useEffect, useRef, useState, lazy, Suspense } from 'react';
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
import { marqueeSlides, whatsappUrl } from './constants';
import CustomCursor from './components/CustomCursor';
const Intro3D = lazy(() => import('./components/Intro3D'));
import { useI18n } from './i18n';

/* ---------- Clean light intro (no video, no gradient effects) ---------- */
function Hero() {
  const { t } = useI18n();
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
            {t('hero.title')}
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px',
            marginBottom: '28px', maxWidth: '560px',
          }}>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#44525f' }}>
              {t('hero.p1')}
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#44525f' }}>
              {t('hero.p2')}
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#44525f' }}>{t('hero.p3')}</p>
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  // pointer normalized x in [-1, 1] (left→right); null = pointer outside
  const pointerXRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const loop = [...marqueeSlides, ...marqueeSlides];

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    const imgs = Array.from(track.querySelectorAll('img'));
    imgs.forEach((img) => img.addEventListener('load', measure));
    window.addEventListener('resize', measure);

    const baseSpeed = 55; // px/s, leftward drift

    const tick = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const half = halfWidthRef.current;

      // pointer at center => pause; left => faster left; right => reverse right
      const nx = pointerXRef.current;
      const speed = nx === null ? baseSpeed : baseSpeed * (1 - nx);

      offsetRef.current -= speed * dt;
      if (half > 0) {
        if (offsetRef.current <= -half) offsetRef.current += half;
        else if (offsetRef.current > 0) offsetRef.current -= half;
      }
      track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      imgs.forEach((img) => img.removeEventListener('load', measure));
      window.removeEventListener('resize', measure);
    };
  }, []);

  const handleMove = (e: React.PointerEvent) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerXRef.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  };
  const handleLeave = () => {
    pointerXRef.current = null;
  };

  return (
    <section id="gallery" className="mb-16 mt-16 scroll-mt-20 overflow-hidden md:mt-20">
      <div
        ref={viewportRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="relative select-none"
      >
        <div
          ref={trackRef}
          className="flex w-max will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {loop.map((s, i) => (
        <figure
          key={i}
          data-cursor-image={s.src}
          data-cursor-label={s.title}
          className="group relative mx-3 flex-none overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.05] hover:shadow-2xl h-[280px] md:h-[500px]"
        >
              <img
                src={s.src}
                alt={s.title}
                draggable={false}
                className="h-full w-auto object-cover"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                  {s.tag}
                </div>
                <div className="font-mondwest text-lg leading-tight text-white">
                  {s.title}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'about' | 'gallery' | 'blog'>('home');
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (!window.matchMedia('(pointer:fine)').matches) return true; // mobile: skip intro
    return sessionStorage.getItem('introPlayed') === '1';
  });
  function handleIntroDone() {
    try {
      sessionStorage.setItem('introPlayed', '1');
    } catch {
      /* ignore */
    }
    setIntroDone(true);
  }

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
      <CustomCursor />
      {!introDone && (
        <Suspense fallback={<div className="fixed inset-0 z-[10000] bg-[#051A24]" />}>
          <Intro3D onDone={handleIntroDone} />
        </Suspense>
      )}
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
