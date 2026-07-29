import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import { useI18n, type Lang } from '../i18n';

interface Expertise {
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  tags: string[];
}

// Real focus areas for Louis Ding — architecture × AI × digital fabrication.
const EXPERTISE: Expertise[] = [
  {
    title: { zh: '计算设计', en: 'Computational Design' },
    desc: {
      zh: '以算法与规则驱动形式生成，把设计问题转译为可计算的逻辑。',
      en: 'Driving form-generation with algorithms and rules, translating design problems into computable logic.',
    },
    tags: ['Computational Design', 'Generative'],
  },
  {
    title: { zh: 'AI 辅助建筑设计', en: 'AI-Assisted Architecture' },
    desc: {
      zh: '探索机器学习如何参与方案生成、评估与空间想象。',
      en: 'Exploring how machine learning participates in scheme generation, evaluation, and spatial imagination.',
    },
    tags: ['AI-assisted', 'Diffusion', 'LLM'],
  },
  {
    title: { zh: '参数化建模', en: 'Parametric Modeling' },
    desc: {
      zh: '基于 Grasshopper / Rhino 构建可调整、可迭代的设计系统。',
      en: 'Building adjustable, iterable design systems with Grasshopper / Rhino.',
    },
    tags: ['Grasshopper', 'Rhino'],
  },
  {
    title: { zh: '数字制造', en: 'Digital Fabrication' },
    desc: {
      zh: '从模型到实物：3D 打印、CNC 与机器人加工的实验。',
      en: 'From model to physical object: experiments in 3D printing, CNC and robotic fabrication.',
    },
    tags: ['3D Printing', 'CNC', 'Robotics'],
  },
  {
    title: { zh: '算法脚本', en: 'Algorithmic Scripting' },
    desc: {
      zh: '用 Python 编写设计与数据分析工具，打通工作流。',
      en: 'Writing design and data-analysis tools in Python to connect workflows.',
    },
    tags: ['Python', 'Scripting'],
  },
  {
    title: { zh: '建筑可视化', en: 'Architectural Visualization' },
    desc: {
      zh: '以渲染与图纸讲述空间叙事，连接抽象与体验。',
      en: 'Telling spatial stories through rendering and drawings, connecting abstraction and experience.',
    },
    tags: ['Rendering', 'Visualization'],
  },
];

export default function ExpertiseSection() {
  const { lang, t } = useI18n();
  const N = EXPERTISE.length;
  // Triple the list so the forward auto-scroll can loop seamlessly.
  const items = [...EXPERTISE, ...EXPERTISE, ...EXPERTISE];

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
      <div className="mb-8 flex items-center px-6 md:max-w-4xl md:justify-start md:pr-6">
        <Reveal delay={0.1}>
          <h2 className="text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">
            {t('expertise.pre')}<span className="font-mondwest">{t('expertise.em')}</span>
          </h2>
        </Reveal>
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
          {items.map((e, i) => (
            <div
              key={i}
              className="w-[calc(100vw-48px)] shrink-0 rounded-[32px] bg-white px-6 py-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:w-[427.5px] md:rounded-[40px] md:pl-10 md:pr-10"
            >
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#051A24]/50">
                {t('expertise.label')}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#0D212C]">
                {e.title[lang]}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#051A24]">
                {e.desc[lang]}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#051A24]/5 px-3 py-1 text-xs text-[#051A24]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3 px-6">
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0D212C]/20 transition hover:bg-black/5"
        >
          <ChevronLeft className="h-5 w-5 text-[#0D212C]" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0D212C]/20 transition hover:bg-black/5"
        >
          <ChevronRight className="h-5 w-5 text-[#0D212C]" />
        </button>
      </div>
    </section>
  );
}
