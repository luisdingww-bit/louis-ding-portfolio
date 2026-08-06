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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null);

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

  const current = lightboxIndex !== null ? visible[lightboxIndex] : null;

  const [zoom, setZoom] = useState(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const movedRef = useRef(false);

  function go(delta: number) {
    setLightboxIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length));
    setZoom(false);
    setPan({ x: 0, y: 0 });
  }

  function toggleZoom() {
    setZoom((z) => !z);
    setPan({ x: 0, y: 0 });
  }

  function closeLightbox() {
    setLightboxIndex(null);
    setZoom(false);
    setPan({ x: 0, y: 0 });
  }

  // Lightbox keyboard: ←/→ navigate, Esc close
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, visible.length]);

  async function handleAdd(file: File, title: string, category: string) {
    const blob = await compressFile(file);
    const item = await addItem({ kind: tab, title, category, blob });
    setItems((prev) => [item, ...prev]);
  }

  function requestRemove(item: GalleryItem) {
    setPendingDelete(item);
  }

  function doRemove(item: GalleryItem) {
    if (!item.remote) URL.revokeObjectURL(item.url);
    removeItem(item.id);
    setItems((prev) => prev.filter((p) => p.id !== item.id));
    if (current && current.id === item.id) setLightboxIndex(null);
    setPendingDelete(null);
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
          {visible.map((it, idx) => (
            <div
              key={it.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-[#F6FCFF] shadow-secondary"
            >
              <button onClick={() => setLightboxIndex(idx)} className="block w-full">
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
                onClick={() => requestRemove(it)}
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

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="关闭"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ×
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label={t('gallery.prev')}
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 md:left-6"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label={t('gallery.next')}
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 md:right-6"
          >
            ›
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            aria-label={zoom ? t('gallery.zoomOut') : t('gallery.zoomIn')}
            className="absolute right-4 top-16 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
          >
            {zoom ? '⤡' : '⤢'}
          </button>

          <div
            className="flex max-h-[88vh] flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.url}
              alt={current.title}
              draggable={false}
              onClick={() => {
                if (movedRef.current) {
                  movedRef.current = false;
                  return;
                }
                toggleZoom();
              }}
              onMouseDown={(e) => {
                if (!zoom) return;
                dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
                setDragging(true);
              }}
              onMouseMove={(e) => {
                if (!dragRef.current) return;
                movedRef.current = true;
                setPan({
                  x: dragRef.current.px + (e.clientX - dragRef.current.x),
                  y: dragRef.current.py + (e.clientY - dragRef.current.y),
                });
              }}
              onMouseUp={() => {
                dragRef.current = null;
                setDragging(false);
              }}
              onMouseLeave={() => {
                dragRef.current = null;
                setDragging(false);
              }}
              style={{
                transform: zoom ? `translate(${pan.x}px, ${pan.y}px) scale(2.4)` : undefined,
                transition: dragging ? 'none' : 'transform .18s ease-out',
                cursor: zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
                maxHeight: '78vh',
                maxWidth: '100%',
                borderRadius: 16,
                objectFit: 'contain',
                userSelect: 'none',
              }}
            />
            {current.title && (
              <p className="text-sm font-medium text-white">{current.title}</p>
            )}
            <p className="text-xs text-white/50">
              {lightboxIndex! + 1} / {visible.length}
            </p>
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t('gallery.confirmTitle')}
          text={t('gallery.confirmText')}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => doRemove(pendingDelete)}
        />
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

function ConfirmDialog({
  title,
  text,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-mondwest text-xl font-semibold text-[#051A24]">{title}</h3>
        <p className="mt-2 text-sm text-[#051A24]/60">{text}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-full px-5 py-2 text-sm font-medium text-[#051A24]/70 transition hover:opacity-70"
          >
            {t('gallery.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:scale-105"
          >
            {t('gallery.removeBtn')}
          </button>
        </div>
      </div>
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
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function submit() {
    if (files.length === 0) return;
    setBusy(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await onAdd(files[i], i === 0 ? title.trim() : '', kind === 'works' ? category : '');
      }
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
          {files.length === 0
            ? t('gallery.pickImage')
            : `${files.length} 张已选`}
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
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
            disabled={files.length === 0 || busy}
            className="rounded-full bg-[#051A24] px-6 py-2 text-sm font-medium text-white shadow-primary transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? '…' : t('gallery.addBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
