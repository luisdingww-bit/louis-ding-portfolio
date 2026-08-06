// Gallery persistence layer — replaces the old localStorage base64 approach.
//
// Why IndexedDB:
//  - localStorage caps at ~5MB total; storing images as base64 blows that fast
//    and silently corrupts the gallery. IndexedDB stores Blobs natively and is
//    effectively unlimited for this use case.
//
// Data model (one object store "items", keyPath "id"):
//   { id, kind: 'works'|'photos', title, category, type: 'url'|'blob',
//     url?, blob? }
//  - type 'url'  -> fixed asset/remote URL (seeds); display url = url
//  - type 'blob' -> user upload; we keep the Blob and build an objectURL on load

export type GalleryKind = 'works' | 'photos';

export interface GalleryItem {
  id: string;
  kind: GalleryKind;
  url: string; // display url (object URL for blobs, original for urls)
  title: string;
  category: string; // category key, '' = none
  remote: boolean; // true for fixed seed assets
}

interface StoredRecord {
  id: string;
  kind: GalleryKind;
  title: string;
  category: string;
  type: 'url' | 'blob';
  url?: string;
  blob?: Blob;
}

const DB_NAME = 'louis-gallery';
const DB_VERSION = 1;
const STORE = 'items';

// Old localStorage keys (base64 arrays) — migrated once, then removed.
const LEGACY_KEYS: Record<GalleryKind, string> = {
  works: 'louis-gallery-works',
  photos: 'louis-gallery-photos',
};

const MAX_EDGE = 1600; // longest edge after compression
const JPEG_QUALITY = 0.82;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function toItem(rec: StoredRecord): GalleryItem {
  if (rec.type === 'blob' && rec.blob) {
    return {
      id: rec.id,
      kind: rec.kind,
      url: URL.createObjectURL(rec.blob),
      title: rec.title,
      category: rec.category,
      remote: false,
    };
  }
  return {
    id: rec.id,
    kind: rec.kind,
    url: rec.url ?? '',
    title: rec.title,
    category: rec.category,
    remote: true,
  };
}

/** Compress an uploaded image file to a JPEG Blob (long edge ≤ MAX_EDGE). */
export function compressFile(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas 2d context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('toBlob failed'));
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image load failed'));
    };
    img.src = url;
  });
}

function genId(): string {
  return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Migrate old localStorage base64 arrays into IndexedDB (one-time). */
async function migrateLegacy(db: IDBDatabase, kind: GalleryKind): Promise<void> {
  const key = LEGACY_KEYS[kind];
  const raw = localStorage.getItem(key);
  if (!raw) return;
  try {
    const arr = JSON.parse(raw) as string[];
    const store = tx(db, 'readwrite');
    for (const dataUrl of arr) {
      if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) continue;
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const rec: StoredRecord = {
          id: genId(),
          kind,
          title: '',
          category: kind === 'works' ? 'other' : '',
          type: 'blob',
          blob,
        };
        store.put(rec);
      } catch {
        /* skip unreadable entry */
      }
    }
  } catch {
    /* ignore parse errors */
  } finally {
    localStorage.removeItem(key);
  }
}

export async function loadItems(kind: GalleryKind): Promise<GalleryItem[]> {
  const db = await openDB();
  await migrateLegacy(db, kind);
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readonly').getAll();
    req.onsuccess = () => {
      const items = (req.result as StoredRecord[])
        .filter((r) => r.kind === kind)
        .map(toItem);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export interface NewItemInput {
  kind: GalleryKind;
  title: string;
  category: string;
  blob: Blob;
}

export async function addItem(input: NewItemInput): Promise<GalleryItem> {
  const db = await openDB();
  const id = genId();
  const rec: StoredRecord = {
    id,
    kind: input.kind,
    title: input.title,
    category: input.category,
    type: 'blob',
    blob: input.blob,
  };
  await new Promise<void>((resolve, reject) => {
    const req = tx(db, 'readwrite').put(rec);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  return {
    id,
    kind: input.kind,
    url: URL.createObjectURL(input.blob),
    title: input.title,
    category: input.category,
    remote: false,
  };
}

export async function removeItem(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const req = tx(db, 'readwrite').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/** Seed fixed asset URLs when the store is empty (first run / after reset). */
export async function seedIfEmpty(
  kind: GalleryKind,
  seeds: { url: string; title: string; category: string }[],
): Promise<void> {
  const db = await openDB();
  const existing = await new Promise<StoredRecord[]>((resolve, reject) => {
    const req = tx(db, 'readonly').getAll();
    req.onsuccess = () => resolve(req.result as StoredRecord[]);
    req.onerror = () => reject(req.error);
  });
  if (existing.some((r) => r.kind === kind)) return;
  await new Promise<void>((resolve, reject) => {
    const store = tx(db, 'readwrite');
    for (const s of seeds) {
      const rec: StoredRecord = {
        id: genId(),
        kind,
        title: s.title,
        category: s.category,
        type: 'url',
        url: s.url,
      };
      store.put(rec);
    }
    store.transaction.oncomplete = () => resolve();
    store.transaction.onerror = () => reject(store.transaction.error);
  });
}
