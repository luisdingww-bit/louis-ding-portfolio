import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
  onClick?: () => void;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-opacity hover:opacity-90';

const variants: Record<Variant, string> = {
  // dark pill + complex multi-layered shadow with inset highlight
  primary: 'bg-[#051A24] text-white shadow-primary',
  // white, no border, subtle shadow
  secondary: 'bg-white text-[#051A24] shadow-secondary',
  // white bg with the combined (primary) layered shadow
  tertiary: 'bg-white text-[#051A24] shadow-primary',
};

export default function Button({
  children,
  variant = 'primary',
  href,
  className = '',
  onClick,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const external = href?.startsWith('http');

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
