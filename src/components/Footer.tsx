import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import Button from './Button';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  async function copyWechat() {
    try {
      await navigator.clipboard.writeText('louis__heree');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable; ignore
    }
  }

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
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/luisdingww-bit"
              target="_blank"
              rel="noreferrer"
              className="text-base text-[#051A24] transition hover:opacity-70"
            >
              GitHub
            </a>
            <a
              href="mailto:luisdingww@gmail.com"
              className="text-base text-[#051A24] transition hover:opacity-70"
            >
              Gmail
            </a>
            <button
              type="button"
              onClick={copyWechat}
              className="flex items-center gap-2 text-left text-base text-[#051A24] transition hover:opacity-70"
            >
              <span>WeChat: louis__heree</span>
              {copied && <Check className="h-4 w-4 text-[#051A24]" />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
