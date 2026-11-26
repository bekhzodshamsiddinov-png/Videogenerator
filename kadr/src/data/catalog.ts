import { images } from './kadr';

export type BizId =
  | 'all'
  | 'edu'
  | 'shop'
  | 'cafe'
  | 'beauty'
  | 'clinic'
  | 'auto'
  | 'realty'
  | 'sport'
  | 'fashion';

export const businessTypes: { id: BizId; label: string }[] = [
  { id: 'all', label: 'Barchasi' },
  { id: 'edu', label: "Ta'lim" },
  { id: 'shop', label: "Do'kon" },
  { id: 'cafe', label: 'Kafe va restoran' },
  { id: 'beauty', label: "Go'zallik saloni" },
  { id: 'clinic', label: 'Klinika' },
  { id: 'auto', label: 'Avto' },
  { id: 'realty', label: "Ko'chmas mulk" },
  { id: 'sport', label: 'Sport zal' },
  { id: 'fashion', label: 'Kiyim' },
];

export type Template = {
  id: string;
  title: string;
  biz: Exclude<BizId, 'all'>;
  mode: 'edit' | 'photo';
  duration: string;
  uses: string;
  trend?: boolean;
  image?: string;
  bg: string;
  fg: string;
};

export const templates: Template[] = [
  { id: 't1', title: 'Kurs reklamasi: 30 soniyada', biz: 'edu', mode: 'edit', duration: '0:30', uses: '2.4k', trend: true, image: images.accounting, bg: '#1C1A2E', fg: '#FFFFFF' },
  { id: 't2', title: 'Yangi menyu', biz: 'cafe', mode: 'photo', duration: '0:15', uses: '1.8k', trend: true, image: images.teapot2, bg: '#F3E7D3', fg: '#3B2A17' },
  { id: 't3', title: 'Aksiya: −20%', biz: 'shop', mode: 'photo', duration: '0:10', uses: '3.1k', trend: true, image: images.teapot1, bg: '#D93F45', fg: '#FFFFFF' },
  { id: 't4', title: 'Xizmatlar va narxlar', biz: 'beauty', mode: 'photo', duration: '0:15', uses: '960', bg: '#F7D9DE', fg: '#5A1F2B' },
  { id: 't5', title: 'Shifokor maslahati', biz: 'clinic', mode: 'edit', duration: '0:45', uses: '740', bg: '#DDF1EC', fg: '#0E3B33' },
  { id: 't6', title: 'Avtomobil obzori', biz: 'auto', mode: 'edit', duration: '0:30', uses: '520', bg: '#1F2A37', fg: '#FFFFFF' },
  { id: 't7', title: "Uy ko'rsatuvi", biz: 'realty', mode: 'edit', duration: '0:40', uses: '410', bg: '#E8EEF9', fg: '#14284B' },
  { id: 't8', title: 'Trener motivatsiyasi', biz: 'sport', mode: 'edit', duration: '0:20', uses: '630', bg: '#FFE6CC', fg: '#4A2300' },
  { id: 't9', title: 'Yangi kolleksiya', biz: 'fashion', mode: 'photo', duration: '0:15', uses: '1.2k', bg: '#EDE7FF', fg: '#2A1A66' },
  { id: 't10', title: 'Mahsulot taqdimoti', biz: 'shop', mode: 'photo', duration: '0:15', uses: '2.0k', image: images.teapot3, bg: '#FFD84D', fg: '#111111' },
  { id: 't11', title: 'Ekspert maslahati', biz: 'edu', mode: 'edit', duration: '0:45', uses: '1.1k', image: images.practice, bg: '#1C1A2E', fg: '#FFFFFF' },
  { id: 't12', title: 'Kunlik taom', biz: 'cafe', mode: 'photo', duration: '0:10', uses: '870', bg: '#FFF1DC', fg: '#4A2E0F' },
];

export const projects = [
  { id: 'p1', title: 'Buxgalteriya kursi', status: 'ready', duration: '0:31', date: 'Bugun', image: images.accounting },
  { id: 'p2', title: 'Amaliyot darsi', status: 'rendering', progress: 64, duration: '0:45', date: 'Bugun', image: images.practice },
  { id: 'p3', title: 'Real hujjat', status: 'ready', duration: '0:28', date: 'Kecha', image: images.document },
  { id: 'p4', title: 'Rishton choynak', status: 'ready', duration: '0:15', date: '6-oktabr', image: images.teapot1 },
  { id: 'p5', title: 'Choy to\'plami aksiyasi', status: 'draft', duration: '—', date: '5-oktabr', image: images.teapot2 },
  { id: 'p6', title: 'Naqshli piyola', status: 'ready', duration: '0:12', date: '3-oktabr', image: images.teapot3 },
] as const;

export const plans = [
  { id: 'start', name: "Boshlang'ich", credits: 10, month: 99000, perks: ['10 kredit / oy', '1080p eksport', 'Asosiy shablonlar'] },
  { id: 'pro', name: 'Mobilograf', credits: 50, month: 249000, popular: true, perks: ['50 kredit / oy', 'Kadr belgisisiz', 'Barcha shablonlar', 'PRO optionlar'] },
  { id: 'team', name: 'Agentlik', credits: 200, month: 690000, perks: ['200 kredit / oy', '3 ta jamoa a\'zosi', 'Brend to\'plamlari', 'Ustuvor render'] },
] as const;

export const creditPacks = [
  { id: 'c1', credits: 5, price: 59000 },
  { id: 'c2', credits: 20, price: 199000, save: '15%' },
  { id: 'c3', credits: 60, price: 499000, save: '30%' },
] as const;

export const YEARLY_DISCOUNT = 20;
export const REFERRAL_DISCOUNT = 30;

export const referral = {
  code: 'KADR-DR24',
  link: 't.me/kadr_bot?start=DR24',
  invited: 6,
  subscribed: 3,
  earned: 30,
  nextReward: 5,
  friends: [
    { id: 'f1', name: 'Aziz T.', status: 'Obuna oldi', reward: '+10 kredit' },
    { id: 'f2', name: 'Madina Y.', status: 'Obuna oldi', reward: '+10 kredit' },
    { id: 'f3', name: 'Sardor K.', status: "Ro'yxatdan o'tdi", reward: 'kutilmoqda' },
  ],
};

export const som = (n: number) => `${n.toLocaleString('ru-RU').replace(/,/g, ' ')} so'm`;
