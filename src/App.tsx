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

function Hero() {
  return (
    <section id="top" className="px-6 pt-12 md:pt-16">
      <div className="mx-auto flex max-w-[440px] flex-col items-center text-center">
        <Reveal delay={0.1} className="mb-4">
          <span className="font-mondwest text-[32px] font-semibold tracking-tight text-[#051A24] md:text-[40px] lg:text-[44px]">
            LD
          </span>
        </Reveal>

        <Reveal delay={0.2} className="mb-2">
          <p className="font-mono text-xs text-[#051A24] md:text-sm">Louis Ding 的创意工作室</p>
        </Reveal>

        <Reveal delay={0.3}>
          <h1 className="whitespace-nowrap text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">
            Build the <span className="font-mondwest">next wave</span>,
            <br />
            the <span className="font-mondwest">bold way.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.4} className="mt-5 text-left md:mt-6">
          <div className="flex flex-col gap-6">
            <p className="text-sm leading-relaxed text-[#051A24] md:text-base">
              我是一名建筑专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。
            </p>
            <p className="text-sm leading-relaxed text-[#051A24] md:text-base">
              我正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。
            </p>
            <p className="text-sm leading-relaxed text-[#051A24] md:text-base">目前研究合作、实习与设计项目机会。</p>
          </div>
        </Reveal>

        <Reveal delay={0.5} className="mt-5 flex flex-col gap-3 md:mt-6 md:gap-4 sm:flex-row">
          <Button variant="primary" href={whatsappUrl}>
            Start a chat
          </Button>
          <Button variant="secondary" href="#projects">
            View projects
          </Button>
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
