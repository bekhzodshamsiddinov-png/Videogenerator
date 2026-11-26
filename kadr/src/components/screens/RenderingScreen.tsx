import React from 'react';
import { CheckIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { renderSteps } from '../../data/kadr';

const PROGRESS = 64;
const SIZE = 216;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RenderingScreen() {
  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button variant="secondary">Bosh sahifaga qaytish</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Montaj qilinmoqda" step={4} showBack={false} />
      <div className="px-5">
        <div className="flex flex-col items-center pt-4">
          <div
            className="relative"
            style={{ width: SIZE, height: SIZE }}
            role="progressbar"
            aria-valuenow={PROGRESS}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <svg width={SIZE} height={SIZE} className="-rotate-90">
              <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#EEEAFE" strokeWidth={STROKE} />
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="#5B3DF5"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - PROGRESS / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[52px] font-extrabold leading-none tracking-tight tabular-nums text-ink">
                {PROGRESS}%
              </span>
              <span className="mt-2 text-[14px] font-medium text-muted">~1 daqiqa qoldi</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-[20px] bg-white p-4 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
            <SendIcon className="h-4 w-4" />
          </span>
          <p className="text-[14px] leading-relaxed text-ink">
            Ilovani yopsangiz ham bo'ladi — tayyor bo'lganda Telegramga yuboramiz.
          </p>
        </div>

        <ol className="mt-4 rounded-[22px] bg-white px-4 py-2 shadow-card">
          {renderSteps.map((step) => (
            <li key={step.id} className="flex h-12 items-center gap-3">
              {step.state === 'done' ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : step.state === 'active' ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-tint text-accent">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <span className="h-6 w-6 rounded-full ring-[1.5px] ring-inset ring-[#D4D4CF]" />
              )}
              <span
                className={`text-[15px] ${
                  step.state === 'active'
                    ? 'font-semibold text-ink'
                    : step.state === 'done'
                      ? 'font-medium text-ink'
                      : 'font-medium text-muted'
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </ScreenShell>
  );
}
