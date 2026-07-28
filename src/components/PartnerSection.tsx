import { useCallback, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { marqueeImages } from '../constants';
import Button from './Button';

interface Spawn {
  id: number;
  x: number;
  y: number;
  rot: number;
  img: string;
}

let spawnId = 0;

export default function PartnerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spawns, setSpawns] = useState<Spawn[]>([]);
  const lastSpawn = useRef(0);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const now = performance.now();
    if (now - lastSpawn.current < 80) return; // min 80ms between spawns
    lastSpawn.current = now;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rot = Math.random() * 20 - 10; // -10deg .. +10deg
    const img = marqueeImages[Math.floor(Math.random() * marqueeImages.length)];
    const id = spawnId++;

    setSpawns((prev) => [...prev, { id, x, y, rot, img }]);
    // Fade out + scale down over 1000ms, then clean up.
    setTimeout(() => {
      setSpawns((prev) => prev.filter((s) => s.id !== id));
    }, 1000);
  }, []);

  return (
    <section id="partner" className="w-full px-6 py-12">
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-white px-6 py-48 text-center shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
      >
        <div className="relative z-10">
          <h2 className="font-mondwest mb-12 text-[48px] text-[#0D212C] md:text-[64px] lg:text-[80px]">
            Partner with us
          </h2>
          <div className="flex justify-center">
            <Button variant="primary" href="#partner">
              <img
                src="/louis-ding.jpg"
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              Start chat with Louis
            </Button>
          </div>
        </div>

        {spawns.map((s) => {
          const style = {
            '--r': `${s.rot}deg`,
            left: s.x,
            top: s.y,
            animation: 'partnerFade 1000ms ease-out forwards',
          } as CSSProperties;
          return (
            <img
              key={s.id}
              src={s.img}
              alt=""
              aria-hidden
              className="pointer-events-none absolute h-28 w-40 rounded-xl object-cover shadow-lg"
              style={style}
            />
          );
        })}
      </div>
    </section>
  );
}
