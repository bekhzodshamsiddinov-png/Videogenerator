import React from 'react';
import { images } from '../../data/kadr';

type StylePreviewProps = { id: string };

export function StylePreview({ id }: StylePreviewProps) {
  const base = 'relative aspect-[3/4] overflow-hidden rounded-2xl';

  if (id === 'shop') {
    return (
      <div className={`${base} bg-[#FFD84D]`}>
        <img
          src={images.teapot1}
          alt=""
          className="absolute left-1/2 top-4 h-[60%] w-[78%] -translate-x-1/2 rounded-xl object-cover mix-blend-multiply"
        />
        <span className="absolute bottom-3 left-3 rounded-md bg-ink px-2 py-1 text-[11px] font-extrabold tabular-nums text-white">
          289 000
        </span>
      </div>
    );
  }

  if (id === 'premium') {
    return (
      <div className={`${base} bg-ink`}>
        <div className="absolute inset-x-0 top-5 mx-auto h-20 w-20 overflow-hidden rounded-full bg-white">
          <img src={images.teapot1} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1">
          <span className="h-[3px] w-12 rounded-full bg-white/80" />
          <span className="h-[3px] w-8 rounded-full bg-white/40" />
        </div>
      </div>
    );
  }

  if (id === 'sale') {
    return (
      <div className={`${base} bg-danger`}>
        <span className="absolute left-3 top-3 text-[26px] font-extrabold leading-none text-white">
          -20%
        </span>
        <img
          src={images.teapot1}
          alt=""
          className="absolute bottom-3 right-3 h-[52%] w-[70%] rounded-xl object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${base} bg-[#F3E7D3]`}>
      <img
        src={images.teapot2}
        alt=""
        className="absolute inset-x-3 top-3 h-[52%] w-[calc(100%-24px)] rounded-xl object-cover"
      />
      <div className="absolute inset-x-3 bottom-3 space-y-1.5">
        <div className="flex justify-between">
          <span className="h-[3px] w-12 rounded-full bg-[#6B4F2A]/60" />
          <span className="h-[3px] w-5 rounded-full bg-[#6B4F2A]/60" />
        </div>
        <div className="flex justify-between">
          <span className="h-[3px] w-9 rounded-full bg-[#6B4F2A]/35" />
          <span className="h-[3px] w-5 rounded-full bg-[#6B4F2A]/35" />
        </div>
      </div>
    </div>
  );
}
