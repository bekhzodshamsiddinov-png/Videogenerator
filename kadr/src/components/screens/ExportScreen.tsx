import React, { useState } from 'react';
import { CheckIcon, CopyIcon, CrownIcon, DownloadIcon, HashIcon, LinkIcon, MessageCircleIcon, RefreshCwIcon, SendIcon, SmartphoneIcon, YoutubeIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { images } from '../../data/kadr';

const formats = [
  { id: '9:16', label: '9:16', sub: 'Reels, Shorts', w: 18, h: 32 },
  { id: '1:1', label: '1:1', sub: 'Lenta', w: 26, h: 26 },
  { id: '16:9', label: '16:9', sub: 'YouTube', w: 34, h: 19 },
];
const qualities = [
  { id: '720p', label: '720p', size: '14 MB' },
  { id: '1080p', label: '1080p', size: '27 MB' },
  { id: '4K', label: '4K', size: '96 MB', pro: true },
];
const targets = [
  { id: 'tg', label: 'Telegram kanal', icon: SendIcon },
  { id: 'ig', label: 'Instagram', icon: SmartphoneIcon },
  { id: 'tt', label: 'TikTok', icon: SmartphoneIcon },
  { id: 'yt', label: 'YouTube', icon: YoutubeIcon },
  { id: 'msg', label: 'Xabar', icon: MessageCircleIcon },
  { id: 'link', label: 'Havola', icon: LinkIcon },
];

export function ExportScreen() {
  const [format, setFormat] = useState('9:16');
  const [quality, setQuality] = useState('1080p');
  const [copied, setCopied] = useState(false);
  const size = qualities.find((q) => q.id === quality)?.size;

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button icon={<DownloadIcon className="h-5 w-5" />}>Yuklab olish · {size}</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Yuklab olish va ulashish" />
      <div className="space-y-6 px-5">
        <div className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-card">
          <img src={images.accounting} alt="" className="h-[72px] w-[40px] shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-ink">Buxgalteriya kursi</p>
            <p className="mt-0.5 text-[13px] tabular-nums text-muted">0:31 · 2 ta tuzatish kiritildi</p>
          </div>
          <span className="flex h-8 items-center gap-1 rounded-full bg-[#E7F6EE] px-2.5 text-[12px] font-bold text-success">
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
            Tayyor
          </span>
        </div>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Format</h2>
          <div className="mt-2.5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Format">
            {formats.map((f) => {
              const on = f.id === format;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setFormat(f.id)}
                  className={`flex h-[96px] flex-col items-center justify-center gap-1.5 rounded-2xl ring-1 transition-colors duration-150 ${on ? 'bg-accent-tint ring-accent/40' : 'bg-white ring-line'}`}
                >
                  <span className={`rounded-[4px] border-2 ${on ? 'border-accent' : 'border-[#BDBDB7]'}`} style={{ width: f.w, height: f.h }} />
                  <span className={`text-[14px] font-bold ${on ? 'text-accent' : 'text-ink'}`}>{f.label}</span>
                  <span className="text-[11px] font-medium text-muted">{f.sub}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[12.5px] text-muted">Boshqa formatda AI kadrni o'zi qayta joylaydi — kredit sarflanmaydi.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Sifat</h2>
          <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-2xl bg-field p-1" role="radiogroup" aria-label="Sifat">
            {qualities.map((q) => {
              const on = q.id === quality;
              return (
                <button
                  key={q.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => !q.pro && setQuality(q.id)}
                  className={`flex h-12 flex-col items-center justify-center rounded-xl transition-colors duration-150 ${on ? 'bg-white shadow-card' : ''}`}
                >
                  <span className={`flex items-center gap-1 text-[14px] font-bold ${on ? 'text-accent' : q.pro ? 'text-muted' : 'text-ink'}`}>
                    {q.label}
                    {q.pro ? <CrownIcon className="h-3 w-3 text-[#C98A00]" /> : null}
                  </span>
                  <span className="text-[11px] font-medium tabular-nums text-muted">{q.size}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[22px] bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
              <HashIcon className="h-4 w-4 text-accent" />
              Post matni
            </h2>
            <button type="button" className="flex h-9 items-center gap-1 rounded-full px-2.5 text-[12.5px] font-semibold text-accent">
              <RefreshCwIcon className="h-3.5 w-3.5" />
              Boshqasi
            </button>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">
            Raqamlardan qo'rqmaysizmi? Unda buxgalteriya aynan siz uchun. Real hujjatlar bilan amaliy kurs — ro'yxatdan o'tish havolasi profilda.
          </p>
          <p className="mt-2 text-[13.5px] font-semibold text-accent">#buxgalteriya #kurs #namangan #kasb</p>
          <button
            type="button"
            onClick={() => setCopied(true)}
            className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-canvas text-[14px] font-semibold text-ink ring-1 ring-line"
          >
            {copied ? <CheckIcon className="h-4 w-4 text-success" /> : <CopyIcon className="h-4 w-4" />}
            {copied ? 'Nusxalandi' : 'Matnni nusxalash'}
          </button>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Ulashish</h2>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {targets.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className="flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-white text-[12px] font-semibold text-ink ring-1 ring-line active:scale-95">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-tint text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3 rounded-[20px] bg-ink p-4 text-white">
          <CrownIcon className="h-6 w-6 shrink-0 text-[#FFD84D]" />
          <p className="flex-1 text-[13.5px] leading-snug">
            <span className="font-bold">"Kadr" belgisini olib tashlash</span> va 4K uchun Mobilograf obunasi
          </p>
          <button type="button" className="h-9 rounded-full bg-white px-3 text-[12.5px] font-bold text-ink">Ko'rish</button>
        </div>
      </div>
    </ScreenShell>
  );
}
