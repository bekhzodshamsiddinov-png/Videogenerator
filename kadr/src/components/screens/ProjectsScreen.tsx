import React, { useState } from 'react';
import { EllipsisVerticalIcon, FileEditIcon, Loader2Icon, PlusIcon, SearchIcon } from 'lucide-react';
import { ScreenShell } from '../phone/ScreenShell';
import { TabBar } from '../ui/TabBar';
import { projects } from '../../data/catalog';

const filters = [
  { id: 'all', label: 'Barchasi' },
  { id: 'ready', label: 'Tayyor' },
  { id: 'rendering', label: 'Jarayonda' },
  { id: 'draft', label: 'Qoralama' },
] as const;

export function ProjectsScreen() {
  const [filter, setFilter] = useState<string>('all');
  const list = projects.filter((p) => filter === 'all' || p.status === filter);
  const count = (id: string) => (id === 'all' ? projects.length : projects.filter((p) => p.status === id).length);

  return (
    <ScreenShell footer={<TabBar active="projects" />}>
      <div className="px-5">
        <div className="flex h-12 items-center justify-between">
          <h1 className="text-[24px] font-extrabold tracking-tight text-ink">Loyihalar</h1>
          <button type="button" aria-label="Yangi loyiha" className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-accent active:scale-95">
            <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
        <label className="mt-3 flex h-12 items-center gap-2 rounded-2xl bg-white px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
          <SearchIcon className="h-[18px] w-[18px] text-muted" />
          <input placeholder="Loyiha qidirish" aria-label="Loyiha qidirish" className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/80 focus:outline-none" />
        </label>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5" role="tablist">
          {filters.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f.id)}
                className={`flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13.5px] font-semibold ring-1 transition-colors duration-150 ${on ? 'bg-ink text-white ring-ink' : 'bg-white text-ink ring-line'}`}
              >
                {f.label}
                <span className={`tabular-nums ${on ? 'text-white/60' : 'text-muted'}`}>{count(f.id)}</span>
              </button>
            );
          })}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3">
          {list.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-[20px] bg-white shadow-card">
              <div className="relative aspect-[4/5] bg-field">
                <img src={p.image} alt={p.title} className={`h-full w-full object-cover ${p.status === 'draft' ? 'opacity-50 grayscale' : ''}`} />
                {p.status === 'rendering' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/50 text-white">
                    <Loader2Icon className="h-5 w-5 animate-spin" />
                    <span className="text-[18px] font-extrabold tabular-nums">{'progress' in p ? p.progress : 0}%</span>
                  </div>
                ) : null}
                {p.status === 'draft' ? (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-ink">
                    <FileEditIcon className="h-3 w-3" /> Qoralama
                  </span>
                ) : null}
                {p.status === 'ready' ? (
                  <span className="absolute bottom-2 left-2 rounded-md bg-ink/75 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white">{p.duration}</span>
                ) : null}
              </div>
              <div className="flex items-start gap-1 p-3 pr-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{p.title}</p>
                  <p className="mt-0.5 text-[12px] font-medium text-muted">{p.date}</p>
                </div>
                <button type="button" aria-label="Amallar" className="flex h-9 w-9 items-center justify-center rounded-full text-muted">
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ScreenShell>
  );
}
