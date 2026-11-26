import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ImagePlusIcon, LayoutGridIcon, MicIcon, WandSparklesIcon, XIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { StylePreview } from './StylePreview';
import { productPhotos, videoStyles } from '../../data/kadr';
import { businessTypes } from '../../data/catalog';

const inputClass =
  'h-[52px] w-full rounded-2xl bg-white px-4 text-[15px] text-ink ring-1 ring-line placeholder:text-muted/70 transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent';

export function PhotoToVideoScreen() {
  const [voice, setVoice] = useState(true);
  const [style, setStyle] = useState<string>('shop');
  const [biz, setBiz] = useState<string>('shop');

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button>Video yaratish · 3 kredit</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Rasmdan video" />
      <div className="space-y-6 px-5">
        <section>
          <h2 className="text-[15px] font-bold text-ink">Biznesingiz turi</h2>
          <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5" role="radiogroup" aria-label="Biznes turi">
            {businessTypes.filter((b) => b.id !== 'all').map((b) => {
              const on = b.id === biz;
              return (
                <button key={b.id} type="button" role="radio" aria-checked={on} onClick={() => setBiz(b.id)}
                  className={`h-10 shrink-0 whitespace-nowrap rounded-full px-3.5 text-[13.5px] font-semibold ring-1 transition-colors duration-150 ${on ? 'bg-accent text-white ring-accent' : 'bg-white text-ink ring-line'}`}>
                  {b.label}
                </button>
              );
            })}
          </div>
          <button type="button" className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[14px] font-semibold text-ink ring-1 ring-line">
            <LayoutGridIcon className="h-4 w-4 text-accent" />
            Shu yo'nalishdagi tayyor shablonlar · 4 ta
          </button>
        </section>

        <section>
          <ul className="grid grid-cols-3 gap-2.5">
            {productPhotos.map((photo) => (
              <li key={photo.id} className="relative aspect-square overflow-hidden rounded-2xl bg-white">
                <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                <button type="button" aria-label="Rasmni o'chirish" className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/55 text-white backdrop-blur">
                  <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-accent/40 bg-accent-tint/60 text-[14px] font-semibold text-accent transition-colors duration-150 hover:bg-accent-tint">
            <ImagePlusIcon className="h-[18px] w-[18px]" />
            Rasm qo'shish
          </button>
          <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-muted">
            <WandSparklesIcon className="h-3.5 w-3.5 text-accent" />
            Fon avtomatik olib tashlanadi
          </p>
        </section>

        <section className="space-y-4">
          <Field id="p-name" label="Nomi">
            <input id="p-name" defaultValue="Rishton choynak to'plami" className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="p-price" label="Narxi" hint="(so'm)">
              <input id="p-price" inputMode="numeric" defaultValue="289 000" className={`${inputClass} tabular-nums`} />
            </Field>
            <Field id="p-sale" label="Aksiya" hint="(ixtiyoriy)">
              <input id="p-sale" placeholder="-20%" className={inputClass} />
            </Field>
          </div>
          <Field id="p-contact" label="Telefon yoki manzil">
            <input id="p-contact" defaultValue="+998 90 123 45 67" className={`${inputClass} tabular-nums`} />
          </Field>
        </section>

        <div className="flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-card">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
            <MicIcon className="h-[18px] w-[18px]" />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-ink">AI diktor ovozi</p>
            <p className="text-[13px] text-muted">O'zbek tilida</p>
          </div>
          <button type="button" role="switch" aria-checked={voice} aria-label="AI diktor ovozi" onClick={() => setVoice((v) => !v)}
            className={`relative h-8 w-[52px] shrink-0 rounded-full transition-colors duration-200 ${voice ? 'bg-accent' : 'bg-[#D9D9D4]'}`}>
            <motion.span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow" animate={{ x: voice ? 20 : 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} />
          </button>
        </div>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Uslub</h2>
          <div role="radiogroup" aria-label="Uslub" className="no-scrollbar -mx-5 mt-2.5 flex gap-3 overflow-x-auto px-5 pb-1 pt-1">
            {videoStyles.map((s) => {
              const active = s.id === style;
              return (
                <button key={s.id} type="button" role="radio" aria-checked={active} onClick={() => setStyle(s.id)} className="w-[124px] shrink-0 text-left">
                  <div className={`relative rounded-2xl transition-shadow duration-150 ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-canvas' : ''}`}>
                    <StylePreview id={s.id} />
                    {active ? (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                        <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>
                  <p className={`mt-2 whitespace-nowrap text-[13px] font-semibold ${active ? 'text-accent' : 'text-ink'}`}>{s.label}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </ScreenShell>
  );
}

type FieldProps = { id: string; label: string; hint?: string; children: React.ReactNode };

function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label} {hint ? <span className="font-medium text-muted">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}
