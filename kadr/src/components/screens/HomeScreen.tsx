import React from 'react';
import { ArrowRightIcon, ChevronRightIcon, ImagePlayIcon, PlayIcon, ScissorsIcon, ZapIcon } from 'lucide-react';
import { ScreenShell } from '../phone/ScreenShell';
import { TabBar } from '../ui/TabBar';
import { TemplateThumb } from '../ui/TemplateThumb';
import { recentProjects } from '../../data/kadr';
import { templates } from '../../data/catalog';

export function HomeScreen() {
  return (
    <ScreenShell footer={<TabBar active="home" />}>
      <div className="px-5">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent">
              <PlayIcon className="h-3.5 w-3.5 fill-white text-white" />
            </span>
            <span className="text-[22px] font-extrabold tracking-tight text-ink">kadr</span>
          </div>
          <button
            type="button"
            className="flex h-10 items-center gap-1.5 rounded-full bg-white pl-1.5 pr-3.5 shadow-card transition-transform duration-150 ease-snappy active:scale-95"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-tint">
              <ZapIcon className="h-3.5 w-3.5 fill-accent text-accent" />
            </span>
            <span className="text-sm font-semibold text-ink">12 kredit</span>
          </button>
        </div>

        <h1 className="mt-5 text-[28px] font-extrabold leading-[1.15] tracking-tight text-ink">
          Bugun qanday video yaratamiz?
        </h1>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            className="block w-full rounded-[24px] bg-accent p-5 text-left text-white shadow-accent transition-transform duration-150 ease-snappy active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <ScissorsIcon className="h-6 w-6" />
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent">
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </div>
            <h2 className="mt-5 text-[22px] font-bold tracking-tight">Videoni montaj qilish</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-white/80">
              Video yuklang — AI pauzalarni kesadi, subtitr, effekt va musiqa qo'yadi
            </p>
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-[24px] bg-white p-5 text-left shadow-card transition-transform duration-150 ease-snappy active:scale-[0.98]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent">
              <ImagePlayIcon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-[17px] font-bold tracking-tight text-ink">Rasmdan video</span>
              <span className="mt-1 block text-[13px] leading-snug text-muted">
                Mahsulot rasmidan tayyor reklama roligi
              </span>
            </span>
            <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted" />
          </button>
        </div>

        <section className="mt-7">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-bold tracking-tight text-ink">G'oya kerakmi?</h2>
            <button type="button" className="text-[14px] font-semibold text-accent">
              Barcha shablonlar
            </button>
          </div>
          <ul className="no-scrollbar -mx-5 mt-3 flex gap-2.5 overflow-x-auto px-5 pb-1">
            {templates.slice(0, 5).map((t) => (
              <li key={t.id} className="w-[118px] shrink-0">
                <button type="button" className="block w-full text-left" aria-label={t.title}>
                  <TemplateThumb t={t} size="sm" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7">
          <h2 className="text-[17px] font-bold tracking-tight text-ink">So'nggi loyihalar</h2>
          <ul className="mt-3 grid grid-cols-3 gap-3">
            {recentProjects.map((project) => (
              <li key={project.id}>
                <button type="button" className="block w-full text-left">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-field">
                    <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                    {project.status === 'rendering' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/45">
                        <span className="text-[20px] font-extrabold tabular-nums text-white">{project.progress}%</span>
                        <div className="absolute inset-x-2.5 bottom-2.5 h-1 overflow-hidden rounded-full bg-white/30">
                          <div className="h-full rounded-full bg-white" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <p className="mt-2 truncate text-[13px] font-semibold text-ink">{project.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-muted">
                    <span className={`h-1.5 w-1.5 rounded-full ${project.status === 'ready' ? 'bg-success' : 'bg-accent'}`} />
                    {project.status === 'ready' ? 'Tayyor' : `Render ${project.progress}%`}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ScreenShell>
  );
}
