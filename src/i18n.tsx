import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'zh';

interface Entry {
  en: string;
  zh: string;
}

/** Full UI dictionary. Add a key here, then call t('key') in components. */
export const dict: Record<string, Entry> = {
  // ── Top nav ──
  'nav.about': { en: 'About', zh: '关于我' },
  'nav.gallery': { en: 'Gallery', zh: '画廊' },
  'nav.blog': { en: 'Blog', zh: '博客' },

  // ── Hero ──
  'hero.title': { en: 'Build the next wave, the bold way.', zh: '以大胆的方式，构筑下一波浪潮。' },
  'hero.p1': {
    en: "I'm an architecture student passionate about the intersection of AI, computational design, and digital fabrication.",
    zh: '我是一名建筑专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。',
  },
  'hero.p2': {
    en: 'Currently applying for graduate studies focused on AI-assisted architectural design, exploring how algorithms can redefine the imagination and practice of space.',
    zh: '正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。',
  },
  'hero.p3': {
    en: 'Open to research collaboration, internships, and design project opportunities.',
    zh: '目前研究合作、实习与设计项目机会。',
  },

  // ── Expertise ──
  'expertise.pre': { en: 'What I ', zh: '我的' },
  'expertise.em': { en: 'do', zh: '专长' },
  'expertise.label': { en: 'Expertise', zh: 'Expertise' },

  // ── SnapPrint showcase ──
  'snapprint.headline': {
    en: "Glad you're here. A photo / a logo / a prompt — instantly turned into a printable 3D model. Your data never leaves your machine. So, what shall we print?",
    zh: '很高兴你来。一张照片 / 一个 Logo / 一句参数，秒变可打印的 3D 模型。数据不出本机。现在，我们打印点什么？',
  },
  'snapprint.cta': { en: 'Join Community', zh: '进入社区' },

  // ── Partner ──
  'partner.heading': { en: 'Partner with us', zh: '与我们合作' },
  'partner.cta': { en: 'Start chat with Louis', zh: '和 Louis 开始聊天' },

  // ── Footer / Bottom nav ──
  'footer.startChat': { en: 'Start a chat', zh: 'Start a chat' },
  'footer.github': { en: 'GitHub', zh: 'GitHub' },
  'footer.gmail': { en: 'Gmail', zh: 'Gmail' },
  'footer.wechat': { en: 'WeChat: louis__heree', zh: 'WeChat: louis__heree' },

  // ── About ──
  'about.back': { en: '← Back', zh: '← 返回首页' },
  'about.title': { en: 'About Me', zh: '关于我' },
  'about.bio': {
    en: "I'm JunHui Ding (Louis Ding), an architecture student at Huaqiao University, passionate about the intersection of AI, computational design, and digital fabrication. I'm applying for graduate studies focused on AI-assisted architectural design, exploring how algorithms can redefine the imagination and practice of space.",
    zh: '我是丁俊晖，华侨大学建筑学专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。我正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。',
  },
  'about.f_name': { en: 'Name', zh: '姓名' },
  'about.f_school': { en: 'School', zh: '学校' },
  'about.f_major': { en: 'Major', zh: '专业' },
  'about.f_focus': { en: 'Focus', zh: '方向' },
  'about.f_location': { en: 'Location', zh: '所在地' },

  // ── Gallery ──
  'gallery.back': { en: '← Back', zh: '← 返回首页' },
  'gallery.title': { en: 'Gallery', zh: '画廊' },
  'gallery.tabWorks': { en: 'My Works', zh: '个人作品' },
  'gallery.tabPhotos': { en: 'My Photos', zh: '个人照片' },
  'gallery.empty': {
    en: 'Nothing here yet — tap the “+” at the bottom right to add.',
    zh: '还没有内容，点击右下角「+」添加。',
  },
  'gallery.confirm': { en: 'Remove this from the gallery?', zh: '从画廊移除这张？' },
  'gallery.catAll': { en: 'All', zh: '全部' },
  'gallery.cat.arch': { en: 'Architecture', zh: '建筑' },
  'gallery.cat.3dprint': { en: '3D Printing', zh: '3D打印' },
  'gallery.cat.render': { en: 'Rendering', zh: '渲染表现' },
  'gallery.cat.computational': { en: 'Computational', zh: '计算设计' },
  'gallery.cat.other': { en: 'Other', zh: '其他' },
  'gallery.emptyWorks': {
    en: 'No works yet — tap “+” to add your first piece.',
    zh: '还没有作品，点击「+」添加第一件吧。',
  },
  'gallery.emptyPhotos': {
    en: 'No photos yet — tap “+” to add one.',
    zh: '还没有照片，点击「+」添加一张吧。',
  },
  'gallery.upload': { en: 'Add to gallery', zh: '添加到画廊' },
  'gallery.pickImage': { en: 'Tap to choose an image', zh: '点击选择图片' },
  'gallery.fieldTitle': { en: 'Title', zh: '标题' },
  'gallery.fieldTitlePh': { en: 'Optional', zh: '选填' },
  'gallery.fieldCategory': { en: 'Category', zh: '分类' },
  'gallery.cancel': { en: 'Cancel', zh: '取消' },
  'gallery.addBtn': { en: 'Add', zh: '添加' },
  'gallery.confirmTitle': { en: 'Remove this?', zh: '移除这张？' },
  'gallery.confirmText': {
    en: 'This will be removed from the gallery.',
    zh: '它将从画廊中移除，且无法撤销。',
  },
  'gallery.removeBtn': { en: 'Remove', zh: '移除' },
  'gallery.prev': { en: 'Previous', zh: '上一张' },
  'gallery.next': { en: 'Next', zh: '下一张' },

  // ── Blog ──
  'blog.back': { en: '← Back', zh: '← 返回首页' },
  'blog.title': { en: 'Articles', zh: '文章记录' },
  'blog.intro': {
    en: 'Notes on architecture, computational design, and AI — learning and project logs. Tap “+” to add one in the browser.',
    zh: '建筑 · 计算设计 · 人工智能 的学习与项目笔记。点击「+」即可在网页内新增一篇。',
  },
  'blog.empty': {
    en: 'No articles yet — tap “+” at the bottom right to start writing.',
    zh: '还没有文章，点击右下角「+」开始记录。',
  },
  'blog.newAria': { en: 'New Article', zh: '新增文章' },
  'blog.untitled': { en: 'Untitled', zh: '未命名文章' },
  'blog.edit': { en: 'Edit', zh: '编辑' },
  'blog.delete': { en: 'Delete', zh: '删除' },
  'blog.detailBack': { en: '← Back to list', zh: '← 返回列表' },
  'blog.editorTitleEdit': { en: 'Edit Article', zh: '编辑文章' },
  'blog.editorTitleNew': { en: 'New Article', zh: '新文章' },
  'blog.f_title': { en: 'Title', zh: '标题' },
  'blog.f_title_ph': { en: 'Give this note a name', zh: '给这篇笔记起个名字' },
  'blog.f_date': { en: 'Date', zh: '日期' },
  'blog.f_cover': { en: 'Cover image (optional)', zh: '封面图（可选）' },
  'blog.f_excerpt': { en: 'Excerpt (optional, auto-filled from body if empty)', zh: '摘要（可选，留空自动截取正文）' },
  'blog.f_excerpt_ph': { en: 'One-line summary', zh: '一句话概括' },
  'blog.f_body': { en: 'Body', zh: '正文' },
  'blog.f_body_ph': { en: 'Write something… line breaks supported', zh: '写点什么……支持换行' },
  'blog.cancel': { en: 'Cancel', zh: '取消' },
  'blog.save': { en: 'Save', zh: '保存' },
  'blog.confirmDel': { en: 'Delete this article?', zh: '确定删除这篇？' },
  'blog.alertTitle': { en: 'Please enter a title', zh: '请填写标题' },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'ld-lang';

const LangContext = createContext<Ctx>({
  lang: 'zh',
  setLang: () => {},
  t: (k: string) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    } catch {
      /* ignore */
    }
    return 'zh'; // default: Chinese (user preference)
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = (key: string) => dict[key]?.[lang] ?? key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useI18n = () => useContext(LangContext);
