import { ArrowUpRight } from 'lucide-react';
import Button from './Button';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Button variant="primary" href="#partner">
            Start a chat
          </Button>
        </div>

        <div className="flex items-start gap-8">
          <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-[#051A24]" />
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <a href="#services" className="text-base text-[#051A24] transition hover:opacity-70">
                Services
              </a>
              <a href="#projects" className="text-base text-[#051A24] transition hover:opacity-70">
                Work
              </a>
              <a href="#about" className="text-base text-[#051A24] transition hover:opacity-70">
                About
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="text-base text-[#051A24] transition hover:opacity-70"
              >
                x.com
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-base text-[#051A24] transition hover:opacity-70"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
