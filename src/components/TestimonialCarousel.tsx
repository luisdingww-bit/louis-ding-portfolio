import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Reveal from './Reveal';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

// Avatars use Pexels-sourced portrait photos (swap for your own if needed).
const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus Anderson',
    role: 'CEO, Data.storage',
    quote:
      'With very little guidance the team delivered designs that were consistently spot on — exactly the kind of taste we needed.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
  {
    name: 'alexwu',
    role: 'Founder, Nexgate',
    quote: 'Louis led the creation of our best fundraising deck to date! The clarity and polish were unmatched.',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
  {
    name: 'James Mitchell',
    role: 'VP Product, LaunchPad',
    quote:
      'Working with Louis transformed our product vision into something we could actually ship with pride.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
  {
    name: 'Rachel Foster',
    role: 'Co-founder, Nexus Labs',
    quote: 'The design quality exceeded our expectations at every single step of the process.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
  {
    name: 'David Zhang',
    role: 'Head of Design, Paradigm Labs',
    quote: 'Incredible work from start to finish. Thoughtful, fast, and rigorously executed.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
];

export default function TestimonialCarousel() {
  const N = TESTIMONIALS.length;
  // Triple the list so the forward auto-scroll can loop seamlessly.
  const items = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // Measure one card + gap so we can translate by exact pixel steps.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      if (first && second) {
        const gap = second.offsetLeft - first.offsetLeft - first.offsetWidth;
        setStep(first.offsetWidth + gap);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Auto-scroll every 3s, paused on hover.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => clearInterval(id);
  }, [paused]);

  // When we've scrolled a full set, snap back without animation.
  const handleTransitionEnd = () => {
    if (index >= N) {
      setWithTransition(false);
      setIndex(index - N);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setWithTransition(true))
      );
    }
  };

  const go = (dir: number) => {
    setWithTransition(true);
    if (dir > 0) {
      setIndex((i) => i + 1);
    } else if (index === 0) {
      setWithTransition(false);
      setIndex(N);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setWithTransition(true);
          setIndex(N - 1);
        })
      );
    } else {
      setIndex((i) => i - 1);
    }
  };

  return (
    <section
      className="w-full py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-8 flex items-center justify-between gap-4 px-6 md:max-w-4xl md:justify-end md:pr-6">
        <Reveal delay={0.1} className="md:order-1">
          <h2 className="text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">
            What <span className="font-mondwest">builders</span> say
          </h2>
        </Reveal>
        <div className="flex shrink-0 items-center gap-2 md:order-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5" fill="black" stroke="black" />
            ))}
          </div>
          <span className="text-sm text-[#0D212C]">Clutch 5/5</span>
        </div>
      </div>

      <div className="overflow-hidden px-6">
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{
            transform: `translateX(-${index * step}px)`,
            transition: withTransition
              ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {items.map((t, i) => (
            <div
              key={i}
              className="w-[calc(100vw-48px)] shrink-0 rounded-[32px] bg-white px-6 py-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:w-[427.5px] md:rounded-[40px] md:pl-10 md:pr-24"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                aria-hidden
                className="mb-4"
              >
                <path
                  fill="#0D212C"
                  d="M9.5 7C7.6 7 6 8.6 6 10.5V17h5.5v-6.5H9.5V10.5c0-.8.7-1.5 1.5-1.5V7Zm9 0C16.6 7 15 8.6 15 10.5V17h5.5v-6.5h-2.5V10.5c0-.8.7-1.5 1.5-1.5V7Z"
                />
              </svg>
              <p className="text-base leading-relaxed text-[#0D212C]">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#0D212C]">{t.name}</p>
                  <p className="flex items-center gap-1 text-sm text-[#051A24]/70">
                    <span className="text-[#0D212C]">→</span> {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3 px-6">
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0D212C]/20 transition hover:bg-black/5"
        >
          <ChevronLeft className="h-5 w-5 text-[#0D212C]" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0D212C]/20 transition hover:bg-black/5"
        >
          <ChevronRight className="h-5 w-5 text-[#0D212C]" />
        </button>
      </div>
    </section>
  );
}
