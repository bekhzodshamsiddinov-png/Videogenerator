import React, { useState } from 'react';
import {
  ArrowRightIcon,
  CheckIcon,
  FilmIcon,
  LibraryIcon,
  MusicIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SparklesIcon,
  UploadIcon,
} from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { musicMoods, userMedia } from '../../data/kadr';

const logoPositions = ['Yuqori o\'ng', 'Yuqori chap', 'Pastda'] as const;
const logoTiming = ['Butun video', 'Faqat oxirida'] as const;
const brollLevels = ['Kamroq', 'Avto', "Ko'proq"] as const;

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1 rounded-2xl bg-field p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o)}
            className={`h-10 whitespace-nowrap rounded-xl px-2 text-[13px] font-semibold transition-[background-color,color,box-shadow] duration-150 ${
              active ? 'bg-white text-accent shadow-card' : 'text-muted hover:text-ink'
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function MediaMusicScreen() {
  const [pos, setPos] = useState<(typeof logoPositions)[number]>("Yuqori o'ng");
  const [timing, setTiming] = useState<(typeof logoTiming)[number]>('Butun video');
  const [broll, setBroll] = useState<(typeof brollLevels)[number]>('Avto');
  const [musicMode, setMusicMode] = useState<'auto' | 'own'>('auto');
  const [mood, setMood] = useState<string>('Ilhomlantiruvchi');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(35);

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button icon={<ArrowRightIcon className="h-5 w-5" />}>Davom etish</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Materiallar va musiqa" step={2} />
      <div className="space-y-7 px-5">
        {/* Logotip */}
        <section>
          <h2 className="text-[15px] font-bold text-ink">Logotip</h2>
          <div className="mt-2.5 flex gap-3 rounded-[20px] bg-white p-3 shadow-card">
            <button
              type="button"
              aria-label="Logotipni almashtirish"
              className="flex h-[88px] w-[88px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-canvas ring-1 ring-line transition-transform duration-150 ease-snappy active:scale-95"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-[13px] font-extrabold tracking-tight text-white">
                K
              </span>
              <span className="text-[11px] font-semibold text-muted">[Logotip]</span>
            </button>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Logotip joylashuvi">
                {logoPositions.map((p) => {
                  const on = p === pos;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setPos(p)}
                      className={`h-9 whitespace-nowrap rounded-full px-3 text-[12.5px] font-semibold ring-1 transition-colors duration-150 ${
                        on ? 'bg-accent-tint text-accent ring-accent/30' : 'bg-white text-ink ring-line'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <Segmented options={logoTiming} value={timing} onChange={setTiming} label="Logotip qachon chiqadi" />
            </div>
          </div>
        </section>

        {/* Qo'shimcha media */}
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-bold text-ink">Qo'shimcha rasm va videolar</h2>
            <span className="text-[13px] font-semibold tabular-nums text-muted">{userMedia.length}/20</span>
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-2">
            {userMedia.map((m) => (
              <div key={m.id} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-field">
                <img src={m.src} alt={m.alt} className="h-full w-full object-cover" />
                {m.kind === 'video' ? (
                  <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
                    <FilmIcon className="h-2.5 w-2.5" />
                    {m.duration}
                  </span>
                ) : null}
                <span className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-0.5 rounded-md bg-white/90 py-0.5 text-[10px] font-bold text-accent backdrop-blur">
                  <SparklesIcon className="h-2.5 w-2.5" />
                  Avto joy
                </span>
              </div>
            ))}
            <button
              type="button"
              className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] border-dashed border-accent/40 bg-accent-tint/50 text-accent transition-transform duration-150 ease-snappy active:scale-95"
            >
              <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
              <span className="text-[11px] font-bold">Qo'shish</span>
            </button>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            AI ularni gap mazmuniga mos joylarga o'zi qo'yadi.
          </p>
        </section>

        {/* AI B-roll */}
        <section>
          <h2 className="text-[15px] font-bold text-ink">AI B-roll va animatsiyalar</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Gap mazmuniga mos stok videolar va 3D animatsiyalar
          </p>
          <div className="mt-2.5">
            <Segmented options={brollLevels} value={broll} onChange={setBroll} label="B-roll miqdori" />
          </div>
        </section>

        {/* Musiqa */}
        <section>
          <h2 className="text-[15px] font-bold text-ink">Fon musiqasi</h2>
          <div className="mt-2.5 space-y-2.5" role="radiogroup" aria-label="Fon musiqasi">
            <div
              className={`rounded-[20px] p-4 ring-1 transition-[background-color,box-shadow] duration-150 ${
                musicMode === 'auto' ? 'bg-accent-tint ring-accent/30' : 'bg-white ring-line'
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={musicMode === 'auto'}
                onClick={() => setMusicMode('auto')}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    musicMode === 'auto' ? 'bg-accent text-white' : 'ring-[1.5px] ring-inset ring-[#CFCFCA]'
                  }`}
                >
                  {musicMode === 'auto' ? <CheckIcon className="h-3 w-3" strokeWidth={3.5} /> : null}
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">AI o'zi tanlaydi</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                    Video kayfiyatiga mos, gapirganda ovozi pasayadi
                  </span>
                </span>
              </button>
              {musicMode === 'auto' ? (
                <div className="mt-3 flex flex-wrap gap-1.5 pl-8">
                  {musicMoods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mood === m}
                      onClick={() => setMood(m)}
                      className={`h-9 whitespace-nowrap rounded-full px-3 text-[12.5px] font-semibold ring-1 transition-colors duration-150 ${
                        mood === m ? 'bg-accent text-white ring-accent' : 'bg-white text-ink ring-line'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div
              className={`rounded-[20px] p-4 ring-1 transition-[background-color,box-shadow] duration-150 ${
                musicMode === 'own' ? 'bg-accent-tint ring-accent/30' : 'bg-white ring-line'
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={musicMode === 'own'}
                onClick={() => setMusicMode('own')}
                className="flex w-full items-center gap-3 text-left"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    musicMode === 'own' ? 'bg-accent text-white' : 'ring-[1.5px] ring-inset ring-[#CFCFCA]'
                  }`}
                >
                  {musicMode === 'own' ? <CheckIcon className="h-3 w-3" strokeWidth={3.5} /> : null}
                </span>
                <span className="text-[15px] font-bold text-ink">O'z musiqam</span>
              </button>
              <div className="mt-3 grid grid-cols-2 gap-2 pl-8">
                <button
                  type="button"
                  onClick={() => setMusicMode('own')}
                  className="flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-white text-[13px] font-semibold text-ink ring-1 ring-line"
                >
                  <UploadIcon className="h-4 w-4 text-muted" />
                  Fayl yuklash
                </button>
                <button
                  type="button"
                  onClick={() => setMusicMode('own')}
                  className="flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-white text-[13px] font-semibold text-ink ring-1 ring-line"
                >
                  <LibraryIcon className="h-4 w-4 text-muted" />
                  Kutubxona
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2.5 rounded-[20px] bg-white p-3 shadow-card">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={playing ? 'Pauza' : 'Tinglash'}
                onClick={() => setPlaying((p) => !p)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform duration-150 ease-snappy active:scale-95"
              >
                {playing ? <PauseIcon className="h-4 w-4 fill-white" /> : <PlayIcon className="ml-0.5 h-4 w-4 fill-white" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-[14px] font-semibold text-ink">
                  <MusicIcon className="h-3.5 w-3.5 text-accent" />
                  Ilhom
                </p>
                <p className="mt-0.5 text-[12px] font-medium tabular-nums text-muted">
                  {musicMode === 'auto' ? `AI tanladi · ${mood}` : 'Sizning faylingiz'} · 96 BPM · 0:45
                </p>
              </div>
            </div>
            <label className="mt-3 block">
              <span className="flex justify-between text-[12px] font-semibold text-muted">
                <span>Musiqa balandligi</span>
                <span className="tabular-nums text-ink">{volume}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer accent-[#5B3DF5]"
              />
            </label>
          </div>
        </section>
      </div>
    </ScreenShell>
  );
}
