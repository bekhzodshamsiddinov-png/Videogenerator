import React, { useState } from 'react';
import { CheckIcon, GiftIcon, ZapIcon } from 'lucide-react';
import { ScreenShell, StickyFooter } from '../phone/ScreenShell';
import { Button } from '../ui/Button';
import { TabBar } from '../ui/TabBar';
import { REFERRAL_DISCOUNT, YEARLY_DISCOUNT, creditPacks, plans, som } from '../../data/catalog';

export function PlansScreen() {
  const [yearly, setYearly] = useState(false);
  const [plan, setPlan] = useState<string>('pro');
  const [hasReferral] = useState(true);

  const price = (m: number) => {
    let p = yearly ? m * (1 - YEARLY_DISCOUNT / 100) : m;
    if (hasReferral) p = p * (1 - REFERRAL_DISCOUNT / 100);
    return Math.round(p / 1000) * 1000;
  };
  const chosen = plans.find((p) => p.id === plan)!;

  return (
    <ScreenShell
      footer={
        <>
          <StickyFooter>
            <Button>
              {chosen.name} · {som(price(chosen.month))}/oy
            </Button>
            <p className="mt-2 text-center text-[12px] text-muted">Click yoki Payme orqali · istalgan vaqtda bekor qilish mumkin</p>
          </StickyFooter>
          <TabBar active="plans" />
        </>
      }
    >
      <div className="px-5">
        <h1 className="pt-1 text-[24px] font-extrabold tracking-tight text-ink">Obuna va kredit</h1>

        <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-ink p-4 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <ZapIcon className="h-5 w-5 fill-[#FFD84D] text-[#FFD84D]" />
          </span>
          <div className="flex-1">
            <p className="text-[12.5px] font-medium text-white/70">Balans</p>
            <p className="text-[20px] font-extrabold tabular-nums">12 kredit</p>
          </div>
          <p className="text-right text-[12px] leading-snug text-white/70">1 kredit =<br />1 daqiqa video</p>
        </div>

        {hasReferral ? (
          <div className="mt-3 flex items-center gap-3 rounded-[20px] bg-[#E7F6EE] p-3.5 ring-1 ring-success/20">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <GiftIcon className="h-5 w-5" />
            </span>
            <p className="text-[13.5px] leading-snug text-ink">
              <span className="font-bold">Aziz T.</span> taklifi bilan kirdingiz — birinchi oyga{' '}
              <span className="font-extrabold text-success">−{REFERRAL_DISCOUNT}% chegirma</span>
            </p>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-field p-1" role="radiogroup" aria-label="To'lov davri">
          {[false, true].map((y) => (
            <button key={String(y)} type="button" role="radio" aria-checked={yearly === y} onClick={() => setYearly(y)}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-[14px] font-semibold transition-colors duration-150 ${yearly === y ? 'bg-white text-ink shadow-card' : 'text-muted'}`}>
              {y ? 'Yillik' : 'Oylik'}
              {y ? <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10.5px] font-bold text-white">−{YEARLY_DISCOUNT}%</span> : null}
            </button>
          ))}
        </div>

        <ul className="mt-3 space-y-2.5" role="radiogroup" aria-label="Tarif">
          {plans.map((p) => {
            const on = p.id === plan;
            const final = price(p.month);
            return (
              <li key={p.id}>
                <button type="button" role="radio" aria-checked={on} onClick={() => setPlan(p.id)}
                  className={`relative block w-full rounded-[22px] p-4 text-left ring-1 transition-[background-color,box-shadow] duration-150 ${on ? 'bg-accent-tint ring-2 ring-accent' : 'bg-white ring-line'}`}>
                  {'popular' in p && p.popular ? (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-white">OMMABOP</span>
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-bold text-ink">{p.name}</p>
                      <p className="mt-0.5 text-[13px] text-muted">{p.credits} kredit / oy</p>
                    </div>
                    <div className="text-right">
                      {final !== p.month ? (
                        <p className="text-[12.5px] font-medium tabular-nums text-muted line-through">{som(p.month)}</p>
                      ) : null}
                      <p className="text-[17px] font-extrabold tabular-nums text-ink">{som(final)}</p>
                      <p className="text-[11.5px] text-muted">oyiga</p>
                    </div>
                  </div>
                  {on ? (
                    <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5">
                      {p.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink">
                          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={3} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <section className="mt-6">
          <h2 className="text-[15px] font-bold text-ink">Faqat kredit sotib olish</h2>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {creditPacks.map((c) => (
              <button key={c.id} type="button" className="relative flex h-[92px] flex-col items-center justify-center rounded-2xl bg-white ring-1 ring-line active:scale-95">
                {'save' in c ? (
                  <span className="absolute -top-2 rounded-full bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">−{c.save}</span>
                ) : null}
                <span className="text-[20px] font-extrabold tabular-nums text-ink">{c.credits}</span>
                <span className="text-[11.5px] font-medium text-muted">kredit</span>
                <span className="mt-1 text-[12px] font-bold tabular-nums text-accent">{som(c.price)}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </ScreenShell>
  );
}
