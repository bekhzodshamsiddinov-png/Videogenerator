import React from 'react';
import { BellIcon, ChevronRightIcon, CrownIcon, GiftIcon, LanguagesIcon, LifeBuoyIcon, LogOutIcon, PaletteIcon, ReceiptIcon, ZapIcon } from 'lucide-react';
import { ScreenShell } from '../phone/ScreenShell';
import { TabBar } from '../ui/TabBar';
import { REFERRAL_DISCOUNT } from '../../data/catalog';

const groups = [
  [
    { icon: PaletteIcon, label: "Brend to'plami", hint: 'Logotip, rang, shrift' },
    { icon: ReceiptIcon, label: "Obuna va to'lovlar", hint: 'Mobilograf · 2-noyabrgacha' },
    { icon: GiftIcon, label: "Do'stlarni taklif qilish", badge: `−${REFERRAL_DISCOUNT}%` },
  ],
  [
    { icon: LanguagesIcon, label: 'Til', value: "O'zbekcha" },
    { icon: BellIcon, label: 'Bildirishnomalar', value: 'Yoqilgan' },
    { icon: LifeBuoyIcon, label: 'Yordam va savollar' },
  ],
];

export function ProfileScreen() {
  return (
    <ScreenShell footer={<TabBar active="profile" />}>
      <div className="px-5">
        <div className="flex items-center gap-4 pt-2">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-[22px] font-extrabold text-white">DR</span>
          <div className="flex-1">
            <p className="text-[20px] font-extrabold tracking-tight text-ink">Dilnoza Rahimova</p>
            <p className="mt-0.5 text-[13.5px] tabular-nums text-muted">@dilnoza_smm · +998 90 *** ** 67</p>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[12px] font-bold text-white">
              <CrownIcon className="h-3.5 w-3.5 text-[#FFD84D]" /> Mobilograf
            </span>
            <button type="button" className="text-[13px] font-semibold text-accent">Tarifni o'zgartirish</button>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
              <ZapIcon className="h-4 w-4 fill-accent text-accent" /> Bu oy
            </p>
            <p className="text-[14px] font-bold tabular-nums text-ink">38 / 50 kredit</p>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-accent-tint">
            <div className="h-full w-[76%] rounded-full bg-accent" />
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { v: '24', l: 'video' },
              { v: '11 s', l: 'tejaldi' },
              { v: '6', l: 'shablon' },
            ].map((s) => (
              <li key={s.l} className="rounded-xl bg-canvas py-2">
                <p className="text-[17px] font-extrabold tabular-nums text-ink">{s.v}</p>
                <p className="text-[11.5px] text-muted">{s.l}</p>
              </li>
            ))}
          </ul>
        </div>

        {groups.map((g, gi) => (
          <ul key={gi} className="mt-4 divide-y divide-line overflow-hidden rounded-[20px] bg-white shadow-card">
            {g.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button type="button" className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2.5 text-left">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-tint text-accent">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-ink">{item.label}</span>
                      {'hint' in item && item.hint ? <span className="block text-[12px] text-muted">{item.hint}</span> : null}
                    </span>
                    {'badge' in item && item.badge ? (
                      <span className="rounded-md bg-success px-1.5 py-0.5 text-[11px] font-bold text-white">{item.badge}</span>
                    ) : null}
                    {'value' in item && item.value ? <span className="text-[13px] text-muted">{item.value}</span> : null}
                    <ChevronRightIcon className="h-4 w-4 text-muted" />
                  </button>
                </li>
              );
            })}
          </ul>
        ))}

        <button type="button" className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[14.5px] font-semibold text-danger">
          <LogOutIcon className="h-4 w-4" /> Chiqish
        </button>
      </div>
    </ScreenShell>
  );
}
