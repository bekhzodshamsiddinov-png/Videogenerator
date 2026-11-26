import React, { useState } from 'react';
import {
  FilmIcon,
  MicIcon,
  MinusIcon,
  MusicIcon,
  PlusIcon,
  ScissorsIcon,
  SparklesIcon,
  StampIcon,
  TypeIcon,
} from 'lucide-react';
import { TelegramBar } from '../phone/TelegramBar';
import { Button } from '../ui/Button';
import { VIDEO_SECONDS, fmt, images, pinpointActions } from '../../data/kadr';

const icons: Record<string, React.ReactNode> = {
  text: <TypeIcon className="h-[18px] w-[18px]" />,
  broll: <FilmIcon className="h-[18px] w-[18px]" />,
  logo: <StampIcon className="h-[18px] w-[18px]" />,
  music: <MusicIcon className="h-[18px] w-[18px]" />,
  cut: <ScissorsIcon className="h-[18px] w-[18px]" />,
  fx: <SparklesIcon className="h-[18px] w-[18px]" />,
};

const frames = [images.accounting, images.practice, images.document, images.accounting, images.practice];

export function PinpointEditScreen() {
  const [start, setStart] = useState(12);
  const [len, setLen] = useState(3);
  const [action, setAction] = useState<string>('broll');
  const end = Math.min(VIDEO_SECONDS, start + len);
  const pct = (t: number) => (t / VIDEO_SECONDS) * 100;

  return (
    <div className="flex h-full flex-col bg-ink">
      <TelegramBar />
      <div className="relative flex-1">
        <img src={images.accounting} alt="0:12 dagi kadr" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1.5 text-[13px] font-bold tabular-nums text-white backdrop-blur">
          Pauza · {fmt(start)}
        </div>

        <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-5 pb-8 pt-2.5 shadow-[0_-12px_40px_rgba(0,0,0,0.25)]">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-line" />
          <div className="mt-3 flex items-baseline justify-between">
            <h1 className="text-[19px] font-bold tracking-tight text-ink">Aniq joyni tuzatish</h1>
            <span className="rounded-lg bg-accent-tint px-2 py-1 text-[13px] font-bold tabular-nums text-accent">
              {fmt(start)} – {fmt(end)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              aria-label="1 soniya orqaga"
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-field text-ink active:scale-95"
            >
              <MinusIcon className="h-4 w-4" strokeWidth={2.6} />
            </button>
            <div className="relative h-12 flex-1 overflow-hidden rounded-xl">
              <div className="flex h-full">
                {frames.map((f, i) => (
                  <img key={i} src={f} alt="" className="h-full flex-1 object-cover opacity-60" />
                ))}
              </div>
              <div
                className="absolute inset-y-0 rounded-lg border-[2.5px] border-accent bg-accent/15"
                style={{ left: `${pct(start)}%`, width: `${pct(end) - pct(start)}%` }}
              />
            </div>
            <button
              type="button"
              aria-label="1 soniya oldinga"
              onClick={() => setStart((s) => Math.min(VIDEO_SECONDS - 1, s + 1))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-field text-ink active:scale-95"
            >
              <PlusIcon className="h-4 w-4" strokeWidth={2.6} />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-muted">
            <span>Davomiyligi</span>
            <div className="flex gap-1" role="radiogroup" aria-label="Davomiyligi">
              {[1, 3, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={len === n}
                  onClick={() => setLen(n)}
                  className={`h-8 rounded-lg px-2.5 text-[12px] font-bold ${len === n ? 'bg-ink text-white' : 'bg-field text-ink'}`}
                >
                  {n} s
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Nima qilamiz">
            {pinpointActions.map((a) => {
              const on = action === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setAction(a.id)}
                  className={`flex h-[64px] flex-col items-center justify-center gap-1 rounded-2xl text-[12px] font-semibold ring-1 transition-colors duration-150 ${
                    on ? 'bg-accent-tint text-accent ring-accent/40' : 'bg-white text-ink ring-line'
                  }`}
                >
                  <span className={on ? 'text-accent' : 'text-muted'}>{icons[a.id]}</span>
                  <span className="whitespace-nowrap">{a.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-3 rounded-2xl bg-canvas ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
            <textarea
              rows={2}
              aria-label="Nimani o'zgartirish kerak"
              placeholder="Nimani o'zgartirish kerak? Masalan: bu yerga choynak videosini qo'y"
              className="block w-full resize-none rounded-2xl bg-transparent p-3.5 pr-14 text-[14px] leading-relaxed text-ink placeholder:text-muted/80 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Ovoz bilan aytish"
              className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent-tint text-accent"
            >
              <MicIcon className="h-[18px] w-[18px]" />
            </button>
          </div>

          <Button className="mt-3" icon={<PlusIcon className="h-5 w-5" strokeWidth={2.5} />}>
            Tuzatishni qo'shish
          </Button>
        </div>
      </div>
    </div>
  );
}
