import React from 'react';
import { CheckIcon, ClockIcon, CoffeeIcon, ImageIcon, PencilIcon, PlayIcon, UsersIcon, WandSparklesIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { TemplateThumb } from '../ui/TemplateThumb';
import { templates } from '../../data/catalog';

const t = templates.find((x) => x.id === 't2')!;

const scenes = [
  { time: '0:00', title: 'Hook', text: '"Bugun yangi menyu!" — katta matn, tez zoom' },
  { time: '0:03', title: 'Taomlar', text: 'Har bir taom rasmi + nomi va narxi' },
  { time: '0:10', title: 'Chaqiruv', text: 'Manzil, telefon va "Buyurtma bering" tugmasi' },
];

const needs = ['3–5 ta taom rasmi', 'Taom nomlari va narxlari', 'Kafe nomi va logotipi', 'Manzil yoki telefon'];

const fields = [
  { label: 'Kafe nomi', value: '[Kafe nomi]' },
  { label: 'Sarlavha', value: 'Bugun yangi menyu!' },
  { label: 'Chaqiruv', value: 'Buyurtma: +998 __ ___ __ __' },
];

export function TemplateDetailScreen() {
  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button icon={<WandSparklesIcon className="h-5 w-5" />}>Shu shablon bilan yaratish</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Shablon" />
      <div className="space-y-6 px-5">
        <div className="flex gap-4">
          <div className="relative w-[138px] shrink-0">
            <TemplateThumb t={t} size="sm" />
            <button type="button" aria-label="Namunani ko'rish" className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur">
              <PlayIcon className="ml-0.5 h-5 w-5 fill-ink" />
            </button>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-accent-tint px-1.5 py-0.5 text-[11px] font-bold text-accent">
              <CoffeeIcon className="h-3 w-3" /> Kafe va restoran
            </span>
            <h1 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight text-ink">{t.title}</h1>
            <ul className="mt-3 space-y-1.5 text-[13px] font-medium text-muted">
              <li className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Rasmdan video</li>
              <li className="flex items-center gap-1.5"><ClockIcon className="h-3.5 w-3.5" /> {t.duration} · 9:16</li>
              <li className="flex items-center gap-1.5"><UsersIcon className="h-3.5 w-3.5" /> {t.uses} kishi ishlatgan</li>
            </ul>
          </div>
        </div>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Sizdan nima kerak</h2>
          <ul className="mt-2.5 space-y-2 rounded-[20px] bg-white p-4 shadow-card">
            {needs.map((n) => (
              <li key={n} className="flex items-center gap-2.5 text-[14px] text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-tint text-accent">
                  <CheckIcon className="h-3 w-3" strokeWidth={3} />
                </span>
                {n}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Sahnalar</h2>
          <ol className="mt-2.5 divide-y divide-line overflow-hidden rounded-[20px] bg-white shadow-card">
            {scenes.map((s) => (
              <li key={s.time} className="flex gap-3 px-4 py-3">
                <span className="h-7 shrink-0 rounded-lg bg-ink px-2 pt-1 text-[12px] font-bold tabular-nums text-white">{s.time}</span>
                <div>
                  <p className="text-[14px] font-bold text-ink">{s.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-ink">O'zgartiriladigan matnlar</h2>
          <div className="mt-2.5 space-y-2">
            {fields.map((f) => (
              <label key={f.label} className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
                <span className="w-20 shrink-0 text-[12.5px] font-semibold text-muted">{f.label}</span>
                <input defaultValue={f.value} className="min-w-0 flex-1 bg-transparent text-[14.5px] font-medium text-ink focus:outline-none" />
                <PencilIcon className="h-4 w-4 text-muted" />
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-muted">Ranglar, musiqa va shriftni keyingi qadamda o'zgartirish mumkin.</p>
        </section>
      </div>
    </ScreenShell>
  );
}
