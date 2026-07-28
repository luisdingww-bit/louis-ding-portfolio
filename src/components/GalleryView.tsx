import { useEffect, useRef, useState } from 'react';
import { marqueeImages } from '../constants';

const WORKS_KEY = 'louis-gallery-works';
const PHOTOS_KEY = 'louis-gallery-photos';
const BASE = import.meta.env.BASE_URL;

function load(key: string, fallback: string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as string[];
  } catch {
    return fallback;
  }
}

type Setter = React.Dispatch<React.SetStateAction<string[]>>;

function handleAdd(setState: Setter, file: File) {
  const r = new FileReader();
  r.onload = () => setState((prev) => [r.result as string, ...prev]);
  r.readAsDataURL(file);
}

function handleRemove(setState: Setter, src: string) {
  setState((prev) => prev.filter((p) => p !== src));
}

export default function GalleryView({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'works' | 'photos'>('works');
  const [works, setWorks] = useState<string[]>(() => load(WORKS_KEY, marqueeImages));
  const [photos, setPhotos] = useState<string[]>(() =>
    load(PHOTOS_KEY, [BASE + 'louis-ding.jpg']),
  );
  const [lightbox, setLightbox] = useState<string | null>(null);

  // auto-persist on change
  useEffect(() => {
    localStorage.setItem(WORKS_KEY, JSON.stringify(works));
  }, [works]);
  useEffect(() => {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  }, [photos]);

  const tabBtn = (key: 'works' | 'photos', label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`rounded-full px-5 py-2 text-sm font-medium transition ${
        tab === key
          ? 'bg-[#051A24] text-white shadow-primary'
          : 'bg-white text-[#051A24] shadow-secondary hover:opacity-80'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <button
          onClick={onBack}
          className="font-mono text-xs text-mist transition hover:opacity-60"
        >
          ← 返回首页
        </button>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-mondwest text-4xl font-semibold tracking-tight text-[#051A24] md:text-5xl">
            画廊
          </h1>
          <div className="flex gap-3">
            {tabBtn('works', '个人作品')}
            {tabBtn('photos', '个人照片')}
          </div>
        </div>
      </header>

      {tab === 'works' ? (
        <EditableGrid
          items={works}
          square={false}
          onAdd={(f) => handleAdd(setWorks, f)}
          onRemove={(s) => handleRemove(setWorks, s)}
          onOpen={setLightbox}
        />
      ) : (
        <EditableGrid
          items={photos}
          square
          onAdd={(f) => handleAdd(setPhotos, f)}
          onRemove={(s) => handleRemove(setPhotos, s)}
          onOpen={setLightbox}
        />
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
}

function EditableGrid({
  items,
  square,
  onAdd,
  onRemove,
  onOpen,
}: {
  items: string[];
  square?: boolean;
  onAdd: (file: File) => void;
  onRemove: (src: string) => void;
  onOpen: (src: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#051A24]/15 py-20 text-center">
          <p className="text-sm text-mist">还没有内容，点击右下角「+」添加。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((src, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-[#F6FCFF] shadow-secondary"
            >
              <button onClick={() => onOpen(src)} className="block w-full">
                <img
                  src={src}
                  alt=""
                  className={`${
                    square ? 'aspect-square' : 'aspect-[3/4]'
                  } w-full object-cover transition duration-500 group-hover:scale-105`}
                />
              </button>
              <button
                onClick={() => {
                  if (confirm('从画廊移除这张？')) onRemove(src);
                }}
                aria-label="删除"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-red-600 opacity-0 shadow-secondary transition group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => ref.current?.click()}
        aria-label="添加"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#051A24] text-3xl leading-none text-white shadow-primary transition hover:scale-105 md:bottom-8"
      >
        +
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onAdd(f);
          e.target.value = '';
        }}
      />
    </>
  );
}
