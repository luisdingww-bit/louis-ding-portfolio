import Reveal from './Reveal';

const PROJECTS = [
  {
    name: 'evr',
    desc: 'From idea to millions raised for a web3 AI product',
    type: 'video' as const,
    src: 'retro-head.mp4',
  },
  {
    name: 'Automation Machines',
    desc: 'Streamlining industrial automation processes',
    type: 'img' as const,
    src: 'https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif',
  },
  {
    name: 'xPortfolio',
    desc: 'Modern portfolio management platform',
    type: 'img' as const,
    src: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  },
];

function ProjectMedia({ type, src, alt }: { type: string; src: string; alt?: string }) {
  if (type === 'video') {
    return (
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#080a10' }}>
        <video
          autoPlay muted loop playsInline preload="auto"
          style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '16/9' }}
          src={import.meta.env.BASE_URL + src}
        />
      </div>
    );
  }
  return (
    <img src={src} alt={alt ?? ''} className="w-full rounded-2xl object-cover shadow-lg" />
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="flex flex-col gap-16 md:gap-20">
        {PROJECTS.map((p) => (
          <div key={p.name}>
            <Reveal delay={0.1} className="ml-20 md:ml-28">
              <h3 className="font-mondwest text-2xl font-semibold text-[#051A24] md:text-3xl">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-[#051A24]/70 md:text-base">{p.desc}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-6">
              <ProjectMedia type={p.type} src={p.src} alt={p.name} />
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
