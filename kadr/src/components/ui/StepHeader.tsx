import React from 'react';
import { ChevronLeftIcon } from 'lucide-react';
import { TOTAL_STEPS } from '../../data/kadr';

type StepHeaderProps = {
  title: string;
  step?: number;
  totalSteps?: number;
  showBack?: boolean;
};

export function StepHeader({ title, step, totalSteps = TOTAL_STEPS, showBack = true }: StepHeaderProps) {
  return (
    <header className="px-5 pb-4 pt-1">
      <div className="flex h-12 items-center gap-3">
        {showBack ? (
          <button
            type="button"
            aria-label="Orqaga"
            className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card transition-transform duration-150 ease-snappy active:scale-95"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        ) : null}
        <h1 className="flex-1 text-[20px] font-bold tracking-tight text-ink">{title}</h1>
        {step ? (
          <span className="text-sm font-semibold tabular-nums text-muted">
            {step}/{totalSteps}
          </span>
        ) : null}
      </div>
      {step ? (
        <div
          className="mt-3 flex gap-1.5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={step}
        >
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-accent' : 'bg-line'}`}
            />
          ))}
        </div>
      ) : null}
    </header>
  );
}
