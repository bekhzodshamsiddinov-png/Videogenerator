import React from 'react';
import { CrownIcon, FolderIcon, HouseIcon, LayoutGridIcon, UserRoundIcon } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Bosh', icon: HouseIcon },
  { id: 'templates', label: 'Shablonlar', icon: LayoutGridIcon },
  { id: 'projects', label: 'Loyihalar', icon: FolderIcon },
  { id: 'plans', label: 'Obuna', icon: CrownIcon },
  { id: 'profile', label: 'Profil', icon: UserRoundIcon },
] as const;

export type TabId = (typeof tabs)[number]['id'];

export function TabBar({ active }: { active: TabId }) {
  return (
    <nav aria-label="Asosiy menyu" className="grid shrink-0 grid-cols-5 border-t border-line bg-white px-1 pb-7 pt-1.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const on = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={on ? 'page' : undefined}
            className={`flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors duration-150 ${
              on ? 'text-accent' : 'text-muted hover:text-ink'
            }`}
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={on ? 2.2 : 1.8} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
