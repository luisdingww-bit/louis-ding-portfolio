import { marqueeSlides } from '../constants';
import Reveal from './Reveal';

/**
 * Obys.agency-style "Selected Works" list.
 * Each row carries [data-cursor-image] so the global CustomCursor shows a
 * floating thumbnail preview on hover — the signature obys interaction.
 * No auto-scrolling marquee; the work reveals itself on hover instead.
 */
export default function WorksList() {
  return (
    <section
      id="gallery"
      className="mx-auto mb-16 mt-20 max-w-[1100px] scroll-mt-20 px-6"
    >
      <Reveal>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-mondwest text-2xl text-[#051A24] md:text-3xl">
            Selected Works
          </h2>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#5b6b7a]">
            {marqueeSlides.length} projects
          </span>
        </div>
      </Reveal>

      <ul>
        {marqueeSlides.map((s, i) => (
          <li key={i}>
            <a
              href="#gallery"
              data-cursor-image={s.src}
              data-cursor-label={s.title}
              className="group flex items-center justify-between border-b border-[#051A24]/15 py-6 transition-transform duration-300 ease-out hover:translate-x-3"
            >
              <span className="flex items-baseline gap-4">
                <span className="w-8 text-sm tabular-nums text-[#9aa7b2]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mondwest text-3xl text-[#051A24] transition-colors duration-300 group-hover:text-[#E8B04B] md:text-5xl">
                  {s.title}
                </span>
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#5b6b7a]">
                {s.tag}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
