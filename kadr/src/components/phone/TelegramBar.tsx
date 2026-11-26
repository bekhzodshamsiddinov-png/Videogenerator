import React from 'react';
import { BatteryFullIcon, EllipsisIcon, SignalIcon, WifiIcon } from 'lucide-react';

export function TelegramBar() {
  return (
    <div className="shrink-0 bg-canvas">
      <div className="flex h-11 items-center justify-between px-7 pt-1 text-ink">
        <span className="text-[15px] font-semibold tabular-nums">9:41</span>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <SignalIcon className="h-4 w-4" strokeWidth={2.4} />
          <WifiIcon className="h-4 w-4" strokeWidth={2.4} />
          <BatteryFullIcon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          className="h-10 rounded-full px-3 text-[15px] font-medium text-muted transition-colors duration-150 hover:text-ink"
        >
          Yopish
        </button>
        <span className="text-[15px] font-semibold text-ink">Kadr</span>
        <button
          type="button"
          aria-label="Menyu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-ink"
        >
          <EllipsisIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
