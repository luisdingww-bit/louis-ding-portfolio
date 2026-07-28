import Reveal from './Reveal';

const PROJECTS = [
  {
    name: 'evr',
    desc: 'From idea to millions raised for a web3 AI product',
    img: 'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  },
  {
    name: 'Automation Machines',
    desc: 'Streamlining industrial automation processes',
    img: 'https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif',
  },
  {
    name: 'xPortfolio',
    desc: 'Modern portfolio management platform',
    img: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  },
];

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
              <img
                src={p.img}
                alt={p.name}
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
