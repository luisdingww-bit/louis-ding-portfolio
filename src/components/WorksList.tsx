import { landmarks, type Landmark } from './landmarks';
import Reveal from './Reveal';

/**
 * Obys.agency-style FLOWING gallery.
 *
 * Project names stream horizontally in two counter-running marquees, auto-filled
 * straight from the `landmarks` content (no placeholder "Work 01-09" anymore).
 * Hovering a name pauses the stream and the global CustomCursor floats the
 * project thumbnail near the pointer — the signature obys interaction.
 */
function MarqueeRow({
  items,
  dir,
}: {
  items: Landmark[];
  dir: 'left' | 'right';
}) {
  // Duplicate the set once so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div className="group/row relative flex overflow-hidden py-2">
      <div
        className={`flex w-max ${
          dir === 'left' ? 'animate-flow-left' : 'animate-flow-right'
        } group-hover/row:[animation-play-state:paused]`}
      >
        {loop.map((l, i) => (
          <a
            key={`${l.id}-${i}`}
            href="#gallery"
            data-cursor-image={l.img}
            data-cursor-label={l.name}
            className="group/item flex shrink-0 items-center gap-6 px-8 py-2"
          >
            <span className="font-mono text-xs tabular-nums text-[#9aa7b2]">
              {String((i % items.length) + 1).padStart(2, '0')}
            </span>
            <span className="whitespace-nowrap font-mondwest text-3xl text-[#051A24] transition-colors duration-300 group-hover/item:text-[#E8B04B] md:text-5xl">
              {l.name}
            </span>
            <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.22em] text-[#5b6b7a]">
              {l.nameCn} · {l.location} · {l.year}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-[#E8B04B]/70" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function WorksList() {
  const rowA = landmarks;
  const rowB = [...landmarks].reverse();

  return (
    <section
      id="gallery"
      className="mx-auto mb-16 mt-20 max-w-[1300px] scroll-mt-20 px-6"
    >
      <Reveal>
        <div className="mb-8 flex items-end justify-between border-b border-[#051A24]/15 pb-4">
          <h2 className="font-mondwest text-2xl text-[#051A24] md:text-3xl">
            Selected Works
          </h2>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#5b6b7a]">
            {landmarks.length} works · flowing
          </span>
        </div>
      </Reveal>

      <div className="relative overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <MarqueeRow items={rowA} dir="left" />
        <MarqueeRow items={rowB} dir="right" />
      </div>

      <style>{`
        @keyframes flowLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes flowRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .animate-flow-left  { animation: flowLeft 38s linear infinite; }
        .animate-flow-right { animation: flowRight 38s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-flow-left, .animate-flow-right { animation: none; }
        }
      `}</style>
    </section>
  );
}
