import React, { useState } from 'react';
import {
  ArrowUpIcon,
  ChevronLeftIcon,
  DownloadIcon,
  MapPinIcon,
  MicIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  SendIcon,
  Trash2Icon,
  WandSparklesIcon,
} from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { Button } from '../ui/Button';
import { VIDEO_SECONDS, fmt, images, initialPins, quickEdits } from '../../data/kadr';

const frames = [images.accounting, images.practice, images.document, images.accounting, images.practice, images.document];

export function ResultScreen() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(12);
  const [pins, setPins] = useState(initialPins);
  const [message, setMessage] = useState('');

  const pct = (t: number) => `${(t / VIDEO_SECONDS) * 100}%`;

  const addPin = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setPins((p) => [...p, { id: `e${Date.now()}`, time, text: t }].sort((a, b) => a.time - b.time));
    setMessage('');
  };

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button icon={<WandSparklesIcon className="h-5 w-5" />}>
            Qayta montaj · {pins.length} ta tuzatish
          </Button>
        </StickyFooter>
      }
    >
      <header className="flex h-14 items-center gap-2 px-5">
        <button
          type="button"
          aria-label="Orqaga"
          className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card active:scale-95"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-[20px] font-bold tracking-tight text-ink">Videongiz tayyor</h1>
        <button type="button" aria-label="Yuklab olish" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card active:scale-95">
          <DownloadIcon className="h-[18px] w-[18px]" />
        </button>
        <button type="button" aria-label="Telegramga yuborish" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card active:scale-95">
          <SendIcon className="h-[18px] w-[18px]" />
        </button>
      </header>

      <div className="px-5">
        <div className="relative mx-auto aspect-[9/16] w-[176px] overflow-hidden rounded-[22px] bg-ink shadow-card">
          <img src={images.accounting} alt="Tayyor video kadri" className="h-full w-full object-cover" />
          <p
            className="absolute inset-x-0 bottom-10 px-3 text-center text-[13px] font-extrabold leading-tight text-white"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
          >
            Buxgalteriya <span className="text-[#FFD84D]">siz uchun</span>
          </p>
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[11px] font-extrabold text-ink">K</span>
          <button
            type="button"
            aria-label={playing ? 'Pauza' : "Ko'rish"}
            onClick={() => setPlaying((p) => !p)}
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur active:scale-95"
          >
            {playing ? <PauseIcon className="h-5 w-5 fill-ink" /> : <PlayIcon className="ml-0.5 h-5 w-5 fill-ink" />}
          </button>
          <span className="absolute bottom-2 left-2 rounded-md bg-ink/75 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white">
            {fmt(time)} / {fmt(VIDEO_SECONDS)}
          </span>
        </div>

        {/* Timeline */}
        <section className="mt-4 rounded-[22px] bg-white p-3 shadow-card" aria-label="Vaqt shkalasi">
          <div className="relative pt-5">
            {pins.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-label={`${fmt(p.time)} dagi tuzatish`}
                onClick={() => setTime(p.time)}
                className="absolute top-0 -translate-x-1/2 text-accent"
                style={{ left: pct(p.time) }}
              >
                <MapPinIcon className="h-4 w-4 fill-accent-tint" strokeWidth={2.4} />
              </button>
            ))}
            <div className="relative flex h-12 overflow-hidden rounded-xl">
              {frames.map((f, i) => (
                <img key={i} src={f} alt="" className="h-full flex-1 object-cover" />
              ))}
              <div className="absolute inset-y-0 left-0 bg-white/40" style={{ width: 0 }} />
            </div>
            <div
              className="pointer-events-none absolute bottom-[-4px] top-4 w-[3px] -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_2px_white]"
              style={{ left: pct(time) }}
            />
            <input
              type="range"
              min={0}
              max={VIDEO_SECONDS}
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              aria-label="Vaqtni tanlash"
              className="absolute inset-x-0 bottom-0 h-12 w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold tabular-nums text-muted">0:00</span>
            <button
              type="button"
              onClick={() => addPin(message || 'Shu joyni o\'zgartirish')}
              className="flex h-9 items-center gap-1 whitespace-nowrap rounded-full bg-accent-tint px-3 text-[13px] font-semibold text-accent active:scale-95"
            >
              <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.6} />
              {fmt(time)} ga izoh
            </button>
            <span className="text-[12px] font-semibold tabular-nums text-muted">{fmt(VIDEO_SECONDS)}</span>
          </div>
        </section>

        {/* Pinned edits */}
        <section className="mt-4">
          <h2 className="text-[15px] font-bold text-ink">
            Tuzatishlar <span className="text-muted">· {pins.length}</span>
          </h2>
          <ul className="mt-2.5 divide-y divide-line overflow-hidden rounded-[20px] bg-white shadow-card">
            {pins.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-3.5 py-3">
                <button
                  type="button"
                  onClick={() => setTime(p.time)}
                  className="h-8 shrink-0 rounded-lg bg-accent px-2 text-[12px] font-bold tabular-nums text-white"
                >
                  {fmt(p.time)}
                </button>
                <p className="min-w-0 flex-1 text-[14px] leading-snug text-ink">{p.text}</p>
                <button type="button" aria-label="Tahrirlash" className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-ink">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="O'chirish"
                  onClick={() => setPins((all) => all.filter((x) => x.id !== p.id))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-danger"
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Composer */}
        <section className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {quickEdits.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => addPin(chip)}
                className="h-8 whitespace-nowrap rounded-full bg-white px-3 text-[12.5px] font-semibold text-ink ring-1 ring-line hover:ring-accent/30"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex h-14 items-center gap-1.5 rounded-2xl bg-white pl-2 pr-1.5 ring-1 ring-line transition-shadow duration-150 focus-within:ring-2 focus-within:ring-accent">
            <span className="shrink-0 rounded-lg bg-accent-tint px-2 py-1.5 text-[12px] font-bold tabular-nums text-accent">
              {fmt(time)}
            </span>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPin(message)}
              placeholder="da nimani o'zgartiramiz?"
              aria-label="Tuzatish so'rovi"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/80 focus:outline-none"
            />
            <button type="button" aria-label="Ovoz bilan" className="flex h-11 w-11 items-center justify-center rounded-xl text-accent">
              <MicIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Qo'shish"
              onClick={() => addPin(message)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-white active:scale-95 ${message ? 'bg-accent' : 'bg-[#C9C9C4]'}`}
            >
              <ArrowUpIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </section>
      </div>
    </ScreenShell>
  );
}
