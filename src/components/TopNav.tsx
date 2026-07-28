// Top navigation bar — entry points for Gallery (站内作品滚动) and Blog (外链).
// Stays pinned to the top while scrolling.
export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#051A24]/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-mondwest text-2xl font-semibold tracking-tight text-[#051A24]"
        >
          LD
        </a>

        <nav className="flex items-center gap-6 sm:gap-8">
          <a
            href="#gallery"
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            画廊
          </a>
          <a
            href="https://personal-neng-site.surge.sh"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm text-[#051A24] transition hover:opacity-60"
          >
            博客 ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
