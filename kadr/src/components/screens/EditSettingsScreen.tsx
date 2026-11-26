import React, { useState } from 'react';
import { ArrowRightIcon, CheckIcon, MicIcon, PlusIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { editFeatures, editStyles, images } from '../../data/kadr';

export function EditSettingsScreen() {
  const [style, setStyle] = useState<string>('Ekspert');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(editFeatures.filter((f) => f.defaultOn).map((f) => f.id)),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <p className="mb-3 text-center text-[13px] text-muted">
            Format: <span className="font-semibold text-ink">9:16</span> ·{' '}
            <span className="font-semibold text-ink">{selected.size} ta tanlandi</span> ·{' '}
            <span className="font-semibold text-ink">2 kredit</span>
          </p>
          <Button icon={<ArrowRightIcon className="h-5 w-5" />}>Davom etish</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Montaj sozlamalari" step={1} />
      <div className="space-y-7 px-5">
        <div className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-card">
          <img
            src={images.accounting}
            alt=""
            className="h-14 w-10 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-ink">kamera_A.mp4</p>
            <p className="mt-0.5 text-[13px] tabular-nums text-muted">1:50 · 1080p</p>
          </div>
          <button
            type="button"
            className="flex h-11 items-center gap-1 whitespace-nowrap rounded-xl bg-accent-tint px-3 text-[14px] font-semibold text-accent transition-transform duration-150 ease-snappy active:scale-95"
          >
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} />
            Kamera
          </button>
        </div>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Tayyor uslub</h2>
          <div
            role="radiogroup"
            aria-label="Tayyor uslub"
            className="mt-2.5 grid grid-cols-3 gap-1 rounded-2xl bg-field p-1"
          >
            {editStyles.map((s) => {
              const active = s === style;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStyle(s)}
                  className={`h-11 rounded-xl text-[14px] font-semibold transition-[background-color,color,box-shadow] duration-150 ${
                    active ? 'bg-white text-accent shadow-card' : 'text-muted hover:text-ink'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Montajda nimalar bo'lsin?</h2>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {editFeatures.map((f) => {
              const on = selected.has(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  aria-disabled={f.pro}
                  onClick={() => !f.pro && toggle(f.id)}
                  className={`flex h-[76px] flex-col justify-between rounded-2xl p-3 text-left ring-1 transition-[background-color,box-shadow] duration-150 ${
                    on
                      ? 'bg-accent-tint ring-accent/30'
                      : f.pro
                        ? 'bg-white/60 ring-line'
                        : 'bg-white ring-line hover:ring-accent/30'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-150 ${
                        on ? 'bg-accent text-white' : 'bg-white ring-[1.5px] ring-inset ring-[#CFCFCA]'
                      }`}
                    >
                      {on ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                    {f.pro ? (
                      <span className="rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                        PRO
                      </span>
                    ) : f.isNew ? (
                      <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                        YANGI
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`whitespace-nowrap text-[14px] font-semibold ${
                      f.pro ? 'text-muted' : 'text-ink'
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
            Logotip, qo'shimcha rasm-videolar va musiqani keyingi qadamda tanlaysiz.
          </p>
        </section>

        <section>
          <label htmlFor="edit-note" className="text-[15px] font-bold text-ink">
            O'z so'zingiz bilan <span className="font-medium text-muted">· ixtiyoriy</span>
          </label>
          <div className="relative mt-2.5 rounded-2xl bg-white ring-1 ring-line transition-shadow duration-150 focus-within:ring-2 focus-within:ring-accent">
            <textarea
              id="edit-note"
              rows={3}
              placeholder="Masalan: oxirida kursga havola qo'y, subtitr sariq bo'lsin"
              className="block w-full resize-none rounded-2xl bg-transparent p-4 pr-16 text-[15px] leading-relaxed text-ink placeholder:text-muted/80 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Ovoz bilan yozish"
              className="absolute bottom-2.5 right-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-accent transition-transform duration-150 ease-snappy active:scale-95"
            >
              <MicIcon className="h-5 w-5" />
            </button>
          </div>
        </section>
      </div>
    </ScreenShell>
  );
}
