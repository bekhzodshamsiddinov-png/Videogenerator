import React, { useState } from 'react';
import { CheckIcon, CopyIcon, GiftIcon, PercentIcon, SendIcon, UserPlusIcon, ZapIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { StepHeader } from '../ui/StepHeader';
import { Button } from '../ui/Button';
import { REFERRAL_DISCOUNT, referral } from '../../data/catalog';

const steps = [
  { icon: SendIcon, title: 'Havolani yuboring', text: 'Telegram orqali do\'stingizga yoki guruhga' },
  { icon: PercentIcon, title: `Do'stingiz −${REFERRAL_DISCOUNT}% oladi`, text: 'Birinchi oylik obunasiga chegirma' },
  { icon: ZapIcon, title: 'Siz +10 kredit olasiz', text: 'Har bir obuna olgan do\'stingiz uchun' },
];

export function ReferralScreen() {
  const [copied, setCopied] = useState(false);
  const progress = (referral.subscribed / referral.nextReward) * 100;

  return (
    <ScreenShell
      footer={
        <StickyFooter>
          <Button icon={<SendIcon className="h-5 w-5" />}>Telegramda ulashish</Button>
        </StickyFooter>
      }
    >
      <StepHeader title="Do'stlarni taklif qiling" />
      <div className="space-y-5 px-5">
        <div className="rounded-[24px] bg-accent p-5 text-white shadow-accent">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <GiftIcon className="h-6 w-6" />
          </span>
          <p className="mt-4 text-[22px] font-extrabold leading-tight tracking-tight">
            Do'stingizga −{REFERRAL_DISCOUNT}%,<br />sizga +10 kredit
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/12 p-1.5 pl-3.5 ring-1 ring-white/25">
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold tabular-nums">{referral.link}</span>
            <button type="button" onClick={() => setCopied(true)} className="flex h-10 items-center gap-1.5 rounded-xl bg-white px-3 text-[13px] font-bold text-accent">
              {copied ? <CheckIcon className="h-4 w-4" strokeWidth={3} /> : <CopyIcon className="h-4 w-4" />}
              {copied ? 'Nusxalandi' : 'Nusxa'}
            </button>
          </div>
          <p className="mt-2 text-[12.5px] text-white/75">Promo-kod: <span className="font-bold text-white">{referral.code}</span></p>
        </div>

        <ul className="grid grid-cols-3 gap-2">
          {[
            { v: referral.invited, l: 'Taklif qilindi' },
            { v: referral.subscribed, l: 'Obuna oldi' },
            { v: `+${referral.earned}`, l: 'Kredit oldingiz' },
          ].map((s) => (
            <li key={s.l} className="rounded-2xl bg-white p-3 text-center shadow-card">
              <p className="text-[22px] font-extrabold tabular-nums text-ink">{s.v}</p>
              <p className="mt-0.5 text-[11.5px] font-medium text-muted">{s.l}</p>
            </li>
          ))}
        </ul>

        <div className="rounded-[20px] bg-white p-4 shadow-card">
          <div className="flex items-baseline justify-between">
            <p className="text-[14px] font-bold text-ink">5 ta obuna = 1 oy bepul</p>
            <p className="text-[13px] font-bold tabular-nums text-accent">{referral.subscribed}/{referral.nextReward}</p>
          </div>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-accent-tint">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Qanday ishlaydi</h2>
          <ol className="mt-2.5 space-y-2">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-[14px] font-bold text-ink">{i + 1}. {title}</p>
                  <p className="text-[12.5px] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-ink">Taklif qilganlaringiz</h2>
          <ul className="mt-2.5 divide-y divide-line overflow-hidden rounded-[20px] bg-white shadow-card">
            {referral.friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-field text-[13px] font-bold text-ink">
                  {f.name.slice(0, 1)}
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-ink">{f.name}</p>
                  <p className="text-[12px] text-muted">{f.status}</p>
                </div>
                <span className={`text-[13px] font-bold ${f.reward.startsWith('+') ? 'text-success' : 'text-muted'}`}>{f.reward}</span>
              </li>
            ))}
            <li>
              <button type="button" className="flex h-12 w-full items-center justify-center gap-1.5 text-[14px] font-semibold text-accent">
                <UserPlusIcon className="h-4 w-4" /> Yana taklif qilish
              </button>
            </li>
          </ul>
        </section>
      </div>
    </ScreenShell>
  );
}
