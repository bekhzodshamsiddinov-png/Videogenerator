import React from 'react';
import { PhoneFrame } from './components/phone/PhoneFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { EditSettingsScreen } from './components/screens/EditSettingsScreen';
import { MediaMusicScreen } from './components/screens/MediaMusicScreen';
import { TranscriptScreen } from './components/screens/TranscriptScreen';
import { RenderingScreen } from './components/screens/RenderingScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { PinpointEditScreen } from './components/screens/PinpointEditScreen';
import { ExportScreen } from './components/screens/ExportScreen';
import { PhotoToVideoScreen } from './components/screens/PhotoToVideoScreen';
import { TemplatesScreen } from './components/screens/TemplatesScreen';
import { TemplateDetailScreen } from './components/screens/TemplateDetailScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { PlansScreen } from './components/screens/PlansScreen';
import { ReferralScreen } from './components/screens/ReferralScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

const groups = [
  {
    title: 'Video montaj',
    screens: [
      { title: 'Bosh sahifa', Component: HomeScreen },
      { title: 'Montaj sozlamalari', Component: EditSettingsScreen },
      { title: 'Materiallar va musiqa', Component: MediaMusicScreen },
      { title: 'Matnni tekshiring', Component: TranscriptScreen },
      { title: 'Montaj qilinmoqda', Component: RenderingScreen },
    ],
  },
  {
    title: 'Tayyor videodan keyin',
    screens: [
      { title: 'Videongiz tayyor', Component: ResultScreen },
      { title: 'Aniq joyni tuzatish', Component: PinpointEditScreen },
      { title: 'Yuklab olish va ulashish', Component: ExportScreen },
    ],
  },
  {
    title: 'Shablonlar va rasmdan video',
    screens: [
      { title: 'Shablonlar', Component: TemplatesScreen },
      { title: 'Shablon tafsiloti', Component: TemplateDetailScreen },
      { title: 'Rasmdan video', Component: PhotoToVideoScreen },
    ],
  },
  {
    title: 'Hisob',
    screens: [
      { title: 'Loyihalar', Component: ProjectsScreen },
      { title: 'Obuna va kredit', Component: PlansScreen },
      { title: "Do'stlarni taklif qilish", Component: ReferralScreen },
      { title: 'Profil', Component: ProfileScreen },
    ],
  },
];

export function App() {
  let n = 0;
  return (
    <div className="min-h-full w-full bg-[#E8E8E3] font-sans text-ink">
      <header className="px-12 pb-4 pt-12">
        <p className="text-[28px] font-extrabold tracking-tight">kadr</p>
        <p className="mt-1 text-sm font-medium text-muted">Telegram Mini App · 390×844 · 15 ta ekran</p>
      </header>
      {groups.map((g) => (
        <section key={g.title} className="pb-10">
          <h2 className="px-12 pb-5 pt-6 text-[22px] font-extrabold tracking-tight text-ink">{g.title}</h2>
          <div className="overflow-x-auto pb-6">
            <div className="flex w-max gap-12 px-12">
              {g.screens.map(({ title, Component }) => {
                n += 1;
                return (
                  <PhoneFrame key={title} index={n} title={title}>
                    <Component />
                  </PhoneFrame>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
