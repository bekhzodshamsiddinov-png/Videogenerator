import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { ScreenShell } from '../phone/ScreenShell';
import { TabBar } from '../ui/TabBar';
import { TemplateThumb } from '../ui/TemplateThumb';
import { businessTypes, templates } from '../../data/catalog';

const modes = [
  { id: 'all', label: 'Hammasi' },
  { id: 'edit', label: 'Video montaj' },
  { id: 'photo', label: 'Rasmdan video' },
] as const;

export function TemplatesScreen() {
  const [biz, setBiz] = useState<string>('all');
  const [mode, setMode] = useState<string>('all');
  const list = templates.filter((t) => (biz === 'all' || t.biz === biz) && (mode === 'all' || t.mode === mode));

  return (
    <ScreenShell footer={<TabBar active="templates" />}>
      <div className="px-5">
        <h1 className="pt-1 text-[24px] font-extrabold tracking-tight text-ink">Shablonlar</h1>
        <p className="mt-1 text-[14px] text-muted">Biznesingizni tanlang — tayyor g'oyani o'zgartirib, o'z reklamangizni yarating</p>

        <label className="mt-4 flex h-12 items-center gap-2 rounded-2xl bg-white px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
          <SearchIcon className="h-[18px] w-[18px] text-muted" />
          <input placeholder="Masalan: aksiya, menyu, kurs" aria-label="Shablon qidirish" className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/80 focus:outline-none" />
        </label>

        <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-field p-1" role="radiogroup" aria-label="Turi">
          {modes.map((m) => {
            const on = m.id === mode;
            return (
              <button key={m.id} type="button" role="radio" aria-checked={on} onClick={() => setMode(m.id)}
                className={`h-10 whitespace-nowrap rounded-xl text-[13px] font-semibold transition-colors duration-150 ${on ? 'bg-white text-accent shadow-card' : 'text-muted hover:text-ink'}`}>
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1" role="radiogroup" aria-label="Biznes turi">
          {businessTypes.map((b) => {
            const on = b.id === biz;
            return (
              <button key={b.id} type="button" role="radio" aria-checked={on} onClick={() => setBiz(b.id)}
                className={`h-10 shrink-0 whitespace-nowrap rounded-full px-3.5 text-[13.5px] font-semibold ring-1 transition-colors duration-150 ${on ? 'bg-accent text-white ring-accent' : 'bg-white text-ink ring-line'}`}>
                {b.label}
              </button>
            );
          })}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3">
          {list.map((t) => (
            <li key={t.id}>
              <button type="button" aria-label={t.title} className="block w-full text-left transition-transform duration-150 ease-snappy active:scale-[0.98]">
                <TemplateThumb t={t} />
              </button>
            </li>
          ))}
        </ul>
        {list.length === 0 ? (
          <p className="mt-8 text-center text-[14px] text-muted">Bu yo'nalishda hozircha shablon yo'q — tez orada qo'shamiz.</p>
        ) : null}
      </div>
    </ScreenShell>
  );
}
