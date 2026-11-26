import React, { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Button({
  children,
  variant = 'primary',
  icon,
  className = '',
  onClick,
}: ButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-accent text-white shadow-accent hover:bg-accent-press'
      : 'bg-white text-ink ring-1 ring-line hover:bg-field';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-[16px] font-semibold transition-[transform,background-color] duration-150 ease-snappy active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${styles} ${className}`}
    >
      {children}
      {icon}
    </button>
  );
}

type IconButtonProps = {
  label: string;
  children: ReactNode;
  onClick?: () => void;
};

export function IconButton({ label, children, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-ink ring-1 ring-line transition-[transform,background-color] duration-150 ease-snappy hover:bg-field active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  );
}
