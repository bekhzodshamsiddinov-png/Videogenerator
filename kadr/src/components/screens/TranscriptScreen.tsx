import React, { useState } from 'react';
import { CheckIcon, ClockIcon, RepeatIcon, ScissorsIcon, SparklesIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { transcript } from '../../data/kadr';

export function TranscriptScreen() {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  const toggleWord = (key: string) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button icon={<CheckIcon className="h-5 w-5" strokeWidth={2.5} />}>
            Tasdiqlash va montaj
          </Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Matnni tekshiring" step={3} />
      <div className="space-y-4 px-5">
        <div className="flex gap-3 rounded-[20px] bg-accent-tint p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-accent">
            <SparklesIcon className="h-[18px] w-[18px]" />
          </span>
          <p className="text-[14px] leading-relaxed text-ink">
            AI nutqni matnga aylantirdi.{' '}
            <span className="rounded bg-warn-tint px-1 font-semibold text-warn">Sariq so'zlarni</span>{' '}
            tekshiring — bosib tuzating.
          </p>
        </div>

        <ul className="flex flex-wrap gap-2">
          <li className="flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-semibold tabular-nums text-white">
            <ClockIcon className="h-3.5 w-3.5" />
            1:50 → 0:31
          </li>
          <li className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-ink ring-1 ring-line">
            <ScissorsIcon className="h-3.5 w-3.5 text-muted" />
            14 pauza kesildi
          </li>
          <li className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-ink ring-1 ring-line">
            <RepeatIcon className="h-3.5 w-3.5 text-muted" />3 ta dubl
          </li>
        </ul>

        <ol className="divide-y divide-line overflow-hidden rounded-[22px] bg-white shadow-card">
          {transcript.map((row) => {
            if (row.kind === 'retake') {
              return (
                <li key={row.id} className="flex gap-3 bg-[#FAFAF8] px-4 py-3.5">
                  <span className="flex w-9 shrink-0 justify-start pt-0.5 text-danger">
                    <ScissorsIcon className="h-4 w-4" />
                  </span>
                  <p className="text-[14px] leading-relaxed text-muted">
                    <span className="font-semibold">Dubl:</span>{' '}
                    <s className="decoration-muted/70">{row.quote}</s>{' '}
                    <span className="font-semibold text-danger">— kesiladi</span>
                  </p>
                </li>
              );
            }
            return (
              <li key={row.id} className="flex gap-3 px-4 py-3.5">
                <span className="w-9 shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-muted">
                  {row.time}
                </span>
                <p className="text-[15px] leading-relaxed text-ink">
                  {row.parts.map((part, i) => {
                    if (!part.uncertain) return <span key={i}>{part.text}</span>;
                    const key = `${row.id}-${i}`;
                    const ok = confirmed.has(key);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleWord(key)}
                        aria-label={`${part.text} — tuzatish`}
                        className={`rounded-md px-1 font-semibold transition-colors duration-150 ${
                          ok
                            ? 'bg-accent-tint text-accent'
                            : 'bg-warn-tint text-warn underline decoration-warn/40 decoration-dotted underline-offset-4'
                        }`}
                      >
                        {part.text}
                      </button>
                    );
                  })}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </ScreenShell>
  );
}
