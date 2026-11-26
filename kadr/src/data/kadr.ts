export const images = {
  accounting:
    'https://cdn.magicpatterns.com/patterns/generated-images/80ab8668-ff8b-4ddf-a86f-89fa70c26fd4.jpg',
  practice:
    'https://cdn.magicpatterns.com/patterns/generated-images/1f2e8d9b-6fa2-4593-81ce-4b6184cae2a2.jpg',
  document:
    'https://cdn.magicpatterns.com/patterns/generated-images/8974d5e6-e61f-4f86-a1b7-70d8be6cfe71.jpg',
  teapot1:
    'https://cdn.magicpatterns.com/patterns/generated-images/5d4490d2-a4bc-43b1-bb25-c92a1f092528.jpg',
  teapot2:
    'https://cdn.magicpatterns.com/patterns/generated-images/1118067f-c387-410e-bfc7-4e48b23a3237.jpg',
  teapot3:
    'https://cdn.magicpatterns.com/patterns/generated-images/13a17184-1841-43bb-9eef-80403cc7a58e.jpg',
};

export const TOTAL_STEPS = 4;

export const recentProjects = [
  { id: 'p1', title: 'Buxgalteriya kursi', status: 'ready', progress: 100, image: images.accounting },
  { id: 'p2', title: 'Amaliyot darsi', status: 'rendering', progress: 64, image: images.practice },
  { id: 'p3', title: 'Real hujjat', status: 'ready', progress: 100, image: images.document },
] as const;

export const editStyles = ['Ekspert', 'Reklama', 'Podkast'] as const;

export const editFeatures = [
  { id: 'cut', label: 'Toza kesish', defaultOn: true, pro: false, isNew: false },
  { id: 'subs', label: 'Subtitr', defaultOn: true, pro: false, isNew: false },
  { id: 'camera', label: 'Dinamik kamera', defaultOn: true, pro: false, isNew: false },
  { id: 'hook', label: 'Hook sarlavha', defaultOn: true, pro: false, isNew: false },
  { id: 'broll', label: 'B-roll video', defaultOn: true, pro: false, isNew: true },
  { id: 'anim', label: 'Animatsiya', defaultOn: true, pro: false, isNew: true },
  { id: 'logo', label: 'Logotip', defaultOn: true, pro: false, isNew: true },
  { id: 'music', label: 'Fon musiqasi', defaultOn: true, pro: false, isNew: true },
  { id: 'sfx', label: 'Ovoz effektlari', defaultOn: false, pro: false, isNew: false },
  { id: 'cta', label: 'CTA tugma', defaultOn: true, pro: false, isNew: false },
  { id: 'infographic', label: 'Infografika', defaultOn: false, pro: true, isNew: false },
  { id: 'background', label: 'Fonni almashtirish', defaultOn: false, pro: true, isNew: false },
];

export type TranscriptPart = { text: string; uncertain?: boolean };

export type TranscriptRow =
  | { id: string; kind: 'line'; time: string; parts: TranscriptPart[] }
  | { id: string; kind: 'retake'; quote: string };

export const transcript: TranscriptRow[] = [
  {
    id: 't1',
    kind: 'line',
    time: '0:00',
    parts: [
      { text: 'Sizdan buxgalter chiqadimi? Buni ' },
      { text: "o'ttiz", uncertain: true },
      { text: ' soniyada bilib olishimiz mumkin.' },
    ],
  },
  { id: 't2', kind: 'retake', quote: "'agar siz raamlardan…'" },
  {
    id: 't3',
    kind: 'line',
    time: '0:04',
    parts: [
      {
        text: "Agar siz raqamlardan qo'rqmasangiz, hujjatlar bilan ishlashni yoqtirsangiz…",
      },
    ],
  },
  {
    id: 't4',
    kind: 'line',
    time: '0:11',
    parts: [{ text: "Buxgalteriya siz uchun bo'lishi mumkin." }],
  },
  {
    id: 't5',
    kind: 'line',
    time: '0:13',
    parts: [
      { text: "Lekin faqat o'qituvchini eshitib yoki video ko'rib, " },
      { text: 'bugalter', uncertain: true },
      { text: " bo'lib qolmaysiz." },
    ],
  },
];

export const renderSteps = [
  { id: 's1', label: 'Nutq tanildi', state: 'done' },
  { id: 's2', label: 'Pauza va dubllar kesildi', state: 'done' },
  { id: 's3', label: 'Montaj rejasi tuzildi', state: 'done' },
  { id: 's4', label: 'B-roll, logotip va musiqa', state: 'active' },
  { id: 's5', label: 'Render', state: 'pending' },
] as const;

export const quickEdits = ['Subtitr kattaroq', 'Musiqani pasaytir', 'Boshqa hook'];

export const productPhotos = [
  { id: 'ph1', src: images.teapot1, alt: 'Rishton choynak, old tomondan' },
  { id: 'ph2', src: images.teapot2, alt: 'Rishton choynak va piyolalar' },
  { id: 'ph3', src: images.teapot3, alt: 'Rishton choynak naqshi' },
];

export const videoStyles = [
  { id: 'shop', label: "Do'kon reklamasi" },
  { id: 'premium', label: 'Premium mahsulot' },
  { id: 'sale', label: 'Aksiya' },
  { id: 'cafe', label: 'Menyu / kafe' },
] as const;

export const userMedia = [
  { id: 'm1', kind: 'image', src: images.document, alt: 'Hujjat rasmi' },
  { id: 'm2', kind: 'image', src: images.practice, alt: 'Dars jarayoni rasmi' },
  { id: 'm3', kind: 'video', src: images.accounting, alt: 'Qisqa video', duration: '0:06' },
] as const;

export const musicMoods = ['Energetik', 'Sokin', 'Ilhomlantiruvchi', 'Premium'] as const;

export const VIDEO_SECONDS = 31;

export const initialPins = [
  { id: 'e1', time: 4, text: 'Bu yerda logotipni kattaroq qil' },
  { id: 'e2', time: 21, text: "Musiqani pasaytir, ovoz eshitilmayapti" },
];

export const pinpointActions = [
  { id: 'text', label: "Matnni o'zgartirish" },
  { id: 'broll', label: "B-roll qo'yish" },
  { id: 'logo', label: 'Logotip' },
  { id: 'music', label: 'Musiqa' },
  { id: 'cut', label: 'Kesib tashlash' },
  { id: 'fx', label: "Effekt qo'shish" },
] as const;

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
