import React, { ReactNode } from 'react';

type PhoneFrameProps = {
  index: number;
  title: string;
  children: ReactNode;
};

export function PhoneFrame({ index, title, children }: PhoneFrameProps) {
  return (
    <figure className="flex shrink-0 flex-col gap-4">
      <figcaption className="flex items-baseline gap-2 px-3">
        <span className="text-sm font-bold tabular-nums text-accent">
          {String(index).padStart(2, '0')}
        </span>
        <span className="text-sm font-semibold text-ink">{title}</span>
      </figcaption>
      <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[48px] bg-canvas shadow-phone">
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-32 -translate-x-1/2 rounded-full bg-ink/85"
        />
      </div>
    </figure>
  );
}
