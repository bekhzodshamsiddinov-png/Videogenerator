import React from 'react';
import {
  Building2Icon,
  CarIcon,
  CoffeeIcon,
  DumbbellIcon,
  FlameIcon,
  GraduationCapIcon,
  ImageIcon,
  ScissorsIcon,
  ShirtIcon,
  SparklesIcon,
  StethoscopeIcon,
  StoreIcon,
} from 'lucide-react';
import type { Template } from '../../data/catalog';

const bizIcon: Record<string, React.ElementType> = {
  edu: GraduationCapIcon,
  shop: StoreIcon,
  cafe: CoffeeIcon,
  beauty: SparklesIcon,
  clinic: StethoscopeIcon,
  auto: CarIcon,
  realty: Building2Icon,
  sport: DumbbellIcon,
  fashion: ShirtIcon,
};

export function TemplateThumb({ t, size = 'md' }: { t: Template; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = bizIcon[t.biz];
  const title = size === 'lg' ? 'text-[22px]' : size === 'md' ? 'text-[14px]' : 'text-[12px]';
  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl" style={{ background: t.bg }}>
      {t.image ? (
        <img src={t.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: t.fg }}>
          <Icon className={size === 'lg' ? 'h-24 w-24 opacity-25' : 'h-12 w-12 opacity-25'} strokeWidth={1.4} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-ink backdrop-blur">
        {t.mode === 'edit' ? <ScissorsIcon className="h-2.5 w-2.5" /> : <ImageIcon className="h-2.5 w-2.5" />}
        {t.mode === 'edit' ? 'Montaj' : 'Rasmdan'}
      </span>
      {t.trend ? (
        <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
          <FlameIcon className="h-2.5 w-2.5" />
          Trend
        </span>
      ) : null}
      <div className="absolute inset-x-2.5 bottom-2.5 text-white">
        <p className={`${title} font-extrabold leading-tight tracking-tight`}>{t.title}</p>
        <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-white/80">
          {t.duration} · {t.uses} marta
        </p>
      </div>
    </div>
  );
}
