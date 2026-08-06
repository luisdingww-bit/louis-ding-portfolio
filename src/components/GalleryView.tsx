import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import {
  loadItems,
  addItem,
  removeItem,
  seedIfEmpty,
  compressFile,
  type GalleryItem,
  type GalleryKind,
} from '../lib/galleryStore';

const BASE = import.meta.env.BASE_URL;

// Works categories (photos stay uncategorized). Key → i18n key.
const WORK_CATEGORIES: { key: string; i18n: string }[] = [
  { key: 'arch', i18n: 'gallery.cat.arch' },
  { key: '3dprint', i18n: 'gallery.cat.3dprint' },
  { key: 'render', i18n: 'gallery.cat.render' },
  { key: 'computational', i18n: 'gallery.cat.computational' },
  { key: 'other', i18n: 'gallery.cat.other' },
];

const SEEDS: Record<GalleryKind, { url: string; title: string; category: string }[]> = {
  works: Array.from({ length: 9 }, (_, i) => ({
    url: `${BASE}pdf_0${i + 1}.jpeg`,
    title: `作品 0${i + 1}`,
    category: 'other',
  })),
  photos: [{ url: `${BASE}louis-ding.jpg`, title: 'Louis Ding', category: '' }],
};

export default function GalleryView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<GalleryKind>('works');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      await seedIfEmpty(tab, SEEDS[tab]);
      const loaded = await loadItems(tab);
      if (alive) setItems(loaded);
    })();
    return () => {
      alive = false;
    };
  }, [tab]);

  const visible =
    tab === 'works' && filter !== 'all'
      ? items.filter((it) => it.category === filter)
      : items;

  async function handleAdd(file: File, title: string, category: string) {
    const blob = await compressFile(file);
    const item = await addItem({ kind: tab, title, category, blob });
    setItems((prev) => [item, ...prev]);
  }

  function handleRemove(item: GalleryItem) {
    if (!confirm(t('gallery.confirm'))) return;
    if (!item.remote) URL.revokeObjectURL(item.url);
    removeItem(item.id);
    setItems((prev) => prev.filter((p) => p.id !== item.id));
  }

  const tabBtn = (key: GalleryKind, label: string) => (
    <button
      onClick={() => {
        setTab(key);
        setFilter('all');
      }}
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
          {t('gallery.back')}
        </button>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-mondwest text-4xl font-semibold tracking-tight text-[#051A24] md:text-5xl">
            {t('gallery.title')}
          </h1>
          <div className="flex gap-3">
            {tabBtn('works', t('gallery.tabWorks'))}
            {tabBtn('photos', t('gallery.tabPhotos'))}
          </div>
        </div>

        {tab === 'works' && (
          <div className="mt-5 flex flex-wrap gap-2">
            <FilterChip
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              label={t('gallery.catAll')}
            />
            {WORK_CATEGORIES.map((c) => (
              <FilterChip
                key={c.key}
                active={filter === c.key}
                onClick={() => setFilter(c.key)}
                label={t(c.i18n)}
              />
            ))}
          </div>
        )}
      </header>

      {visible.length === 0 ? (
        <EmptyState
          text={tab === 'works' ? t('gallery.emptyWorks') : t('gallery.emptyPhotos')}
        />
      ) : (
        <div className="columns-2 gap-4 md:columns-3">
          {visible.map((it) => (
            <div
              key={it.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-[#F6FCFF] shadow-secondary"
            >
              <button onClick={() => setLightbox(it)} className="block w-full">
                <img
                  src={it.url}
                  alt={it.title}
                  loading="lazy"
                  className="w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </button>
              {(it.title || it.category) && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  {it.title && (
                    <p className="text-sm font-medium text-white">{it.title}</p>
                  )}
                  {it.category && tab === 'works' && (
                    <p className="mt-0.5 text-[11px] text-white/70">
                      {t(WORK_CATEGORIES.find((c) => c.key === it.category)?.i18n ?? 'gallery.cat.other')}
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={() => handleRemove(it)}
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
        onClick={() => setUploadOpen(true)}
        aria-label="添加"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#051A24] text-3xl leading-none text-white shadow-primary transition hover:scale-105 md:bottom-8"
      >
        +
      </button>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.url}
            alt={lightbox.title}
            className="max-h-[80vh] max-w-full rounded-2xl object-contain"
          />
          {lightbox.title && (
            <p className="text-sm text-white/80">{lightbox.title}</p>
          )}
        </div>
      )}

      {uploadOpen && (
        <UploadModal
          kind={tab}
          onClose={() => setUploadOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-[#051A24] text-white'
          : 'bg-white text-[#051A24]/70 shadow-secondary hover:opacity-80'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#051A24]/15 py-20 text-center">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="mb-4 text-[#051A24]/30">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.8" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <p className="text-sm text-mist">{text}</p>
    </div>
  );
}

function UploadModal({
  kind,
  onClose,
  onAdd,
}: {
  kind: GalleryKind;
  onClose: () => void;
  onAdd: (file: File, title: string, category: string) => void;
}) {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function submit() {
    if (!file) return;
    setBusy(true);
    try {
      await onAdd(file, title.trim(), kind === 'works' ? category : '');
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-mondwest text-2xl font-semibold text-[#051A24]">
          {t('gallery.upload')}
        </h2>

        <button
          onClick={() => ref.current?.click()}
          className="mt-4 flex w-full items-center justify-center rounded-xl border border-dashed border-[#051A24]/25 py-6 text-sm text-[#051A24]/60 transition hover:border-[#051A24]/50"
        >
          {file ? file.name : t('gallery.pickImage')}
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <label className="mt-4 block text-xs font-medium text-[#051A24]/70">
          {t('gallery.fieldTitle')}
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('gallery.fieldTitlePh')}
          className="mt-1 w-full rounded-xl border border-[#051A24]/15 px-3 py-2 text-sm text-[#051A24] outline-none focus:border-[#051A24]/40"
        />

        {kind === 'works' && (
          <>
            <label className="mt-4 block text-xs font-medium text-[#051A24]/70">
              {t('gallery.fieldCategory')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#051A24]/15 bg-white px-3 py-2 text-sm text-[#051A24] outline-none focus:border-[#051A24]/40"
            >
              {WORK_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {t(c.i18n)}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-medium text-[#051A24]/70 transition hover:opacity-70"
          >
            {t('gallery.cancel')}
          </button>
          <button
            onClick={submit}
            disabled={!file || busy}
            className="rounded-full bg-[#051A24] px-6 py-2 text-sm font-medium text-white shadow-primary transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? '…' : t('gallery.addBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
