import { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import Reveal from './Reveal';

const PARALLAX_IMG = '/louis-ding.jpg';

export default function TestimonialSection() {
  const imgRef = useRef<HTMLImageElement>(null);

  // Parallax: shift the image vertically based on its position in the viewport.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const delta = (elCenter - viewportCenter) / viewportCenter; // ~ -1 .. 1
      const offset = Math.max(-200, Math.min(200, delta * 200));
      el.style.transform = `translateY(${offset}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal delay={0.1} className="mb-6 flex justify-center">
          <Quote className="h-6 w-6 text-slate-900" />
        </Reveal>

        <Reveal delay={0.2} className="mb-6">
          <p className="text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">
            I explore where <span className="font-mondwest">architecture</span> meets artificial intelligence
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mb-10">
          <p className="text-sm italic text-[#273C46]">Louis Ding</p>
        </Reveal>

        <Reveal delay={0.5}>
          <img
            ref={imgRef}
            src={PARALLAX_IMG}
            alt="Louis Ding"
            className="mx-auto w-full max-w-xs rounded-2xl shadow-lg will-change-transform"
          />
        </Reveal>
      </div>
    </section>
  );
}
