// Top navigation bar — entry points for About / Gallery / Blog (all in-site views).
// Stays pinned to the top while scrolling. Includes EN / 中 language switch.
import { useI18n } from '../i18n';

export default function TopNav({
  onHome,
  onAbout,
  onGallery,
  onBlog,
}: {
  onHome: () => void;
  onAbout: () => void;
  onGallery: () => void;
  onBlog: () => void;
}) {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#051A24]/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={onHome}
          aria-label="Louis Ding — home"
          className="flex items-center rounded-full transition hover:opacity-80"
        >
          <img
            src={import.meta.env.BASE_URL + 'favicon.svg'}
            alt="LD"
            className="h-9 w-9 rounded-full shadow-sm"
          />
        </button>

        <nav className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={onAbout}
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={onGallery}
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            {t('nav.gallery')}
          </button>
          <button
            onClick={onBlog}
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            {t('nav.blog')}
          </button>

          {/* Language switch */}
          <div className="ml-1 flex items-center gap-1 rounded-full border border-[#051A24]/15 p-0.5 text-xs">
            <button
              onClick={() => setLang('zh')}
              className={`rounded-full px-2.5 py-1 transition ${
                lang === 'zh' ? 'bg-[#051A24] text-white' : 'text-[#051A24] hover:opacity-70'
              }`}
            >
              中
            </button>
            <button
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 transition ${
                lang === 'en' ? 'bg-[#051A24] text-white' : 'text-[#051A24] hover:opacity-70'
              }`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
