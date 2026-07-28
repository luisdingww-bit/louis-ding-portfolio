// Top navigation bar — entry points for About / Gallery / Blog (all in-site views).
// Stays pinned to the top while scrolling.
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
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#051A24]/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={onHome}
          className="font-mondwest text-2xl font-semibold tracking-tight text-[#051A24]"
        >
          LD
        </button>

        <nav className="flex items-center gap-5 sm:gap-8">
          <button
            onClick={onAbout}
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            关于我
          </button>
          <button
            onClick={onGallery}
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            画廊
          </button>
          <button
            onClick={onBlog}
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            博客
          </button>
        </nav>
      </div>
    </header>
  );
}
