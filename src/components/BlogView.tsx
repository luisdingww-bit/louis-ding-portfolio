import { useRef, useState } from 'react';
import Button from './Button';
import { useI18n } from '../i18n';

interface Article {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  content: string;
}

const STORAGE_KEY = 'louis-blog-articles';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const SAMPLE: Article[] = [
  {
    id: 'seed-1',
    title: '用 Grasshopper 生成一座参数化凉亭',
    date: '2026-07-20',
    excerpt: '从太阳辐射分析出发，用吸引子点驱动结构网格的密度，让结构随人的行为流动。',
    content:
      '这次尝试从场地太阳辐射分析入手，把日照强度作为驱动参数，让凉亭顶棚的开孔密度随光照变化。\n\n在 Grasshopper 里用吸引子点（attractor）控制网格细分：人常停留的区域开口更大、更通透；边缘则更密、更遮蔽。\n\n最终用 Karamba 做了一次快速结构找形，验证了主要受力路径。下一步准备把这套逻辑接到 3D 打印节点上做 1:5 实体原型。',
    image: '',
  },
  {
    id: 'seed-2',
    title: 'AI 辅助建筑设计：从文本到体块',
    date: '2026-07-10',
    excerpt: '用扩散模型做概念体量生成，再回到 Rhino 里做可控修正——让 AI 成为草图阶段的协作者。',
    content:
      '最近在测试把文字描述直接变成体量方案的工作流：先用扩散模型生成概念意象，再用控制网（controlnet）把体块关系固化，最后导入 Rhino 做参数化修正。\n\n关键不是让 AI 替我设计，而是把"反复试错"的成本压到最低——一晚上能比过去一周跑更多方向。\n\n记录几个踩坑：提示词里要显式写材质与尺度；生成结果一定要回到几何约束里校验，否则只是好看的图。',
    image: '',
  },
];

function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
      return SAMPLE;
    }
    return JSON.parse(raw) as Article[];
  } catch {
    return SAMPLE;
  }
}

function save(list: Article[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newDraft(): Article {
  return { id: crypto.randomUUID(), title: '', date: today(), excerpt: '', content: '', image: '' };
}

/* ---------------- Blog list ---------------- */
export default function BlogView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [articles, setArticles] = useState<Article[]>(() => loadArticles());
  const [selected, setSelected] = useState<Article | null>(null);
  const [editor, setEditor] = useState<Article | null>(null);

  function persist(list: Article[]) {
    setArticles(list);
    save(list);
  }

  function handleSave(a: Article) {
    const exists = articles.some((x) => x.id === a.id);
    const list = exists
      ? articles.map((x) => (x.id === a.id ? a : x))
      : [a, ...articles];
    persist(list);
    setEditor(null);
  }

  function handleDelete(id: string) {
    persist(articles.filter((x) => x.id !== id));
    setSelected(null);
  }

  if (selected) {
    return (
      <ArticleDetail
        article={selected}
        onBack={() => setSelected(null)}
        onEdit={(a) => {
          setSelected(null);
          setEditor(a);
        }}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-10">
        <button
          onClick={onBack}
          className="font-mono text-xs text-mist transition hover:opacity-60"
        >
          {t('blog.back')}
        </button>
        <h1 className="mt-3 font-mondwest text-4xl font-semibold tracking-tight text-[#051A24] md:text-5xl">
          {t('blog.title')}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
          {t('blog.intro')}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#051A24]/15 py-20 text-center">
          <p className="text-sm text-mist">{t('blog.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              article={a}
              onOpen={() => setSelected(a)}
              onEdit={() => setEditor(a)}
              onDelete={() => handleDelete(a.id)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setEditor(newDraft())}
        aria-label={t('blog.newAria')}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#051A24] text-3xl leading-none text-white shadow-primary transition hover:scale-105 md:bottom-8"
      >
        +
      </button>

      {editor && (
        <Editor article={editor} onSave={handleSave} onClose={() => setEditor(null)} />
      )}
    </section>
  );
}

/* ---------------- Article card ---------------- */
function ArticleCard({
  article,
  onOpen,
  onEdit,
  onDelete,
}: {
  article: Article;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-secondary transition hover:-translate-y-1">
      <button onClick={onOpen} className="block text-left">
        {article.image ? (
          <img
            src={article.image}
            alt=""
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-[#F6FCFF] font-mondwest text-3xl text-[#051A24]/30">
            ✦
          </div>
        )}
        <div className="p-5">
          <p className="font-mono text-xs text-mist">{article.date}</p>
          <h3 className="mt-1 font-mondwest text-xl font-semibold text-[#051A24]">
            {article.title || t('blog.untitled')}
          </h3>
          {article.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">
              {article.excerpt}
            </p>
          )}
        </div>
      </button>

      <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          aria-label={t('blog.edit')}
          className="rounded-full bg-white/90 px-2 py-1 text-xs text-[#051A24] shadow-secondary"
        >
          {t('blog.edit')}
        </button>
        <button
          onClick={() => {
            if (confirm(t('blog.confirmDel'))) onDelete();
          }}
          aria-label={t('blog.delete')}
          className="rounded-full bg-white/90 px-2 py-1 text-xs text-red-600 shadow-secondary"
        >
          {t('blog.delete')}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Article detail ---------------- */
function ArticleDetail({
  article,
  onBack,
  onEdit,
  onDelete,
}: {
  article: Article;
  onBack: () => void;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <button
        onClick={onBack}
        className="font-mono text-xs text-mist transition hover:opacity-60"
      >
        {t('blog.detailBack')}
      </button>

      {article.image && (
        <img
          src={article.image}
          alt=""
          className="mt-5 w-full rounded-2xl object-cover"
        />
      )}

      <h1 className="mt-5 font-mondwest text-4xl font-semibold leading-tight tracking-tight text-[#051A24] md:text-5xl">
        {article.title || t('blog.untitled')}
      </h1>
      <p className="mt-3 font-mono text-sm text-mist">{article.date}</p>

      <article className="mt-7 whitespace-pre-wrap text-[15px] leading-8 text-[#051A24]">
        {article.content}
      </article>

      <div className="mt-10 flex gap-3">
        <Button variant="secondary" onClick={() => onEdit(article)}>
          {t('blog.edit')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (confirm(t('blog.confirmDel'))) onDelete(article.id);
          }}
        >
          {t('blog.delete')}
        </Button>
      </div>
    </section>
  );
}

/* ---------------- Editor modal ---------------- */
function Editor({
  article,
  onSave,
  onClose,
}: {
  article: Article;
  onSave: (a: Article) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<Article>(article);
  const fileRef = useRef<HTMLInputElement>(null);

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setDraft({ ...draft, image: r.result as string });
    r.readAsDataURL(f);
  }

  function submit() {
    if (!draft.title.trim()) {
      alert(t('blog.alertTitle'));
      return;
    }
    const excerpt = draft.excerpt.trim() || draft.content.trim().slice(0, 60);
    onSave({ ...draft, title: draft.title.trim(), excerpt });
  }

  const inputCls =
    'mt-1 w-full rounded-xl border border-[#051A24]/15 bg-white px-3 py-2 text-sm text-[#051A24] outline-none focus:border-[#051A24]/40';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 font-mondwest text-2xl font-semibold text-[#051A24]">
          {article.id.startsWith('seed') || article.title ? t('blog.editorTitleEdit') : t('blog.editorTitleNew')}
        </h2>

        <label className="block text-xs font-medium text-mist">{t('blog.f_title')}</label>
        <input
          className={inputCls}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder={t('blog.f_title_ph')}
        />

        <label className="mt-4 block text-xs font-medium text-mist">{t('blog.f_date')}</label>
        <input
          type="date"
          className={inputCls}
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
        />

        <label className="mt-4 block text-xs font-medium text-mist">
          {t('blog.f_cover')}
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPickImage}
          className="mt-1 text-sm text-mist"
        />
        {draft.image && (
          <img
            src={draft.image}
            alt=""
            className="mt-2 h-32 w-full rounded-xl object-cover"
          />
        )}

        <label className="mt-4 block text-xs font-medium text-mist">
          {t('blog.f_excerpt')}
        </label>
        <input
          className={inputCls}
          value={draft.excerpt}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          placeholder={t('blog.f_excerpt_ph')}
        />

        <label className="mt-4 block text-xs font-medium text-mist">{t('blog.f_body')}</label>
        <textarea
          className={`${inputCls} h-40 resize-y`}
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          placeholder={t('blog.f_body_ph')}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t('blog.cancel')}
          </Button>
          <Button variant="primary" onClick={submit}>
            {t('blog.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
