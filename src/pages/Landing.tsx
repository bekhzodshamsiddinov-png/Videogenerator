import { useMemo, useState } from 'react'
import {
  Sparkles, Play, PenLine, Users, Layers, Download, GraduationCap, Heart, Briefcase, Video, ChevronDown, Star, Send, ShieldCheck,
} from 'lucide-react'
import { EXAMPLES, exampleScenes, type Example } from '../lib/examples'
import { gradient } from '../lib/types'
import { navigate } from '../lib/router'
import { haptic, openExternal, BOT_URL, BOT_USERNAME } from '../lib/telegram'
import { Button, Modal, SectionTitle } from '../components/ui'
import { VideoPreview } from '../components/VideoPreview'

const steps = [
  { icon: PenLine, t: "G'oya yozing", d: "Bir-ikki gap bilan nima haqida video kerakligini ayting." },
  { icon: Users, t: 'Ssenariy va personajlar', d: 'AI ssenariy yozadi va qahramonlarni chizib beradi.' },
  { icon: Layers, t: 'Sahnalarni tasdiqlang', d: "Har bir sahnani ko'rib, xohlasangiz o'zgartiring." },
  { icon: Download, t: 'Tayyor videoni oling', d: "O'zbekcha ovoz va musiqa bilan MP4 formatda." },
]

const uses = [
  { icon: GraduationCap, t: "O'qituvchilar", d: 'Darslarni qiziqarli multfilmga aylantiring', idea: "Boshlang'ich sinf o'quvchilari uchun kasrlar haqida dars" },
  { icon: Heart, t: 'Ota-onalar', d: 'Farzandingiz uchun shaxsiy ertaklar', idea: "Zarina ismli qiz va uning kuchukchasi haqida ertak" },
  { icon: Briefcase, t: 'Biznes', d: 'Arzon va tez reklama roliklari', idea: "Oilaviy kafemiz haqida reklama" },
  { icon: Video, t: 'Blogerlar', d: 'YouTube va Telegram uchun kontent', idea: "Samarqand afsonalari haqida qiziqarli hikoya" },
]

const reviews = [
  { n: 'Dilnoza', r: "Boshlang'ich sinf o'qituvchisi", t: 'Bolalar darsni endi intiqlik bilan kutishadi. Bir kechada 3 ta mavzuga multfilm tayyorladim.' },
  { n: 'Jasur', r: 'Novvoyxona egasi', t: "Reklama uchun studiyaga katta pul berardim. Bu yerda bir necha daqiqada tayyor bo'ldi." },
  { n: 'Malika', r: 'Ona, 2 farzand', t: "Qizimning ismi bilan ertak yasadim — u buni har kuni qayta ko'radi." },
]

const faqs = [
  { q: 'Video tayyorlash qancha vaqt oladi?', a: "Qisqa videolar 5–15 daqiqada, 10 daqiqalik multfilm taxminan 1 soatda tayyor bo'ladi. Tayyor bo'lganda Telegram orqali xabar beramiz." },
  { q: "O'zbek tilida ovoz bormi?", a: 'Ha. Bola, ayol, erkak va qariya ovozlari bor. Rus va ingliz tillarida ham tayyorlash mumkin.' },
  { q: "Videoni sotsam yoki reklamada ishlatsam bo'ladimi?", a: '«Studiya» tarifida tijorat maqsadida ishlatish huquqi beriladi.' },
  { q: "Qanday to'layman?", a: "Click, Payme, Uzum yoki Humo/Visa kartasi orqali. Obunani istalgan vaqtda bekor qilish mumkin." },
  { q: 'Telefonda ishlaydimi?', a: "Ha. Sahna AI Telegram ichida, iPhone va Android'da ishlaydi — profil sahifasidan ilovani bosh ekranga o'rnatib olishingiz mumkin." },
]

export function startWithIdea(idea: string) {
  const q = idea.trim() ? `?idea=${encodeURIComponent(idea.trim().slice(0, 500))}` : ''
  navigate(`/create${q}`)
}

export function Landing() {
  const [idea, setIdea] = useState('')
  const [faq, setFaq] = useState<number | null>(0)
  const [preview, setPreview] = useState<{ ex: Example; seed: number } | null>(null)
  const [info, setInfo] = useState<'privacy' | 'contact' | null>(null)
  const previewScenes = useMemo(() => (preview ? exampleScenes(preview.ex) : []), [preview])

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-20 pb-14 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
          <Sparkles size={13} aria-hidden /> O'zbek tilidagi AI multfilm studiyasi
        </span>
        <h1 className="mt-5 text-[2.1rem] leading-[1.1] sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          G'oyangizni <span className="text-brand-600">multfilmga</span>
          <br className="hidden sm:block" /> aylantiring
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted max-w-2xl mx-auto">
          Ssenariy, personajlar, ovoz va montaj — hammasini sun'iy intellekt bajaradi. O'zbek tilida.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            haptic('tap')
            startWithIdea(idea)
          }}
          className="mt-7 max-w-2xl mx-auto bg-surface border border-line shadow-sm rounded-2xl p-2 flex flex-col sm:flex-row gap-2"
        >
          <label htmlFor="hero-idea" className="sr-only">
            Qanday video yaratmoqchisiz?
          </label>
          <input
            id="hero-idea"
            value={idea}
            maxLength={500}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Masalan: Bolalar uchun halol mehnat haqida ertak"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl outline-none text-[15px] bg-transparent placeholder:text-faint"
          />
          <button type="submit" className="bg-brand-600 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition">
            <Sparkles size={17} aria-hidden /> Bepul boshlash
          </button>
        </form>
        <p className="mt-3 text-sm text-muted flex items-center justify-center gap-1.5">
          <ShieldCheck size={15} className="text-emerald-600" aria-hidden /> Karta kerak emas · Birinchi video bepul
        </p>

        <div className="mt-10 relative max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setPreview({ ex: EXAMPLES[0], seed: 1 })}
            className={`relative w-full aspect-video rounded-3xl bg-gradient-to-br ${gradient(1)} shadow-xl shadow-brand-600/10 grid place-items-center overflow-hidden group`}
            aria-label="Namuna videoni ko'rish"
          >
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 grid place-items-center shadow-lg group-hover:scale-105 transition">
              <Play className="text-brand-600 ml-1" size={30} fill="currentColor" />
            </span>
            <span className="absolute bottom-4 left-5 text-white font-semibold text-sm sm:text-base drop-shadow">Namuna: «Ali va halol mehnat» · 3 daqiqa</span>
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <SectionTitle title="Qanday ishlaydi" sub="To'rt oddiy qadam. Hech qanday tajriba kerak emas." />
          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-line p-5 bg-bg">
                <div className="flex items-center justify-between">
                  <span className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
                    <s.icon size={20} aria-hidden />
                  </span>
                  <span className="text-3xl font-extrabold text-line">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <SectionTitle title="Sahna AI'da yaratilgan" sub="Namunani bosing — ko'ring va shunga o'xshashini yarating" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLES.map((e, i) => (
            <button
              type="button"
              key={e.title}
              onClick={() => setPreview({ ex: e, seed: i })}
              className="group text-left rounded-2xl bg-surface border border-line overflow-hidden hover:shadow-md transition"
              data-testid="example-card"
            >
              <div className={`relative aspect-video bg-gradient-to-br ${gradient(i)} grid place-items-center`}>
                <span className="w-12 h-12 rounded-full bg-white/85 grid place-items-center group-hover:scale-110 transition">
                  <Play size={20} className="text-stone-800 ml-0.5" fill="currentColor" aria-hidden />
                </span>
                <span className="absolute bottom-2.5 right-2.5 text-xs font-semibold bg-black/55 text-white px-2 py-0.5 rounded-md">{e.dur}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-muted">{e.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <SectionTitle title="Kimlar uchun?" sub="O'zingizga mosini tanlang — g'oya tayyor holda ochiladi" />
          <div className="mt-9 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {uses.map((u) => (
              <button
                type="button"
                key={u.t}
                onClick={() => {
                  haptic('tap')
                  startWithIdea(u.idea)
                }}
                className="text-center rounded-2xl p-4 sm:p-6 border border-line hover:border-brand-200 hover:bg-brand-50/40 transition"
              >
                <span className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 grid place-items-center">
                  <u.icon size={22} aria-hidden />
                </span>
                <p className="mt-3 font-semibold">{u.t}</p>
                <p className="mt-1 text-xs sm:text-sm text-muted">{u.d}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <SectionTitle title="Foydalanuvchilar fikri" />
        <div className="mt-9 grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <figure key={r.n} className="rounded-2xl bg-surface border border-line p-6">
              <div className="flex gap-0.5 text-amber-400" aria-label="5 yulduz">
                {[0, 1, 2, 3, 4].map((k) => (
                  <Star key={k} size={15} fill="currentColor" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-3 leading-relaxed">«{r.t}»</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold grid place-items-center">{r.n[0]}</span>
                <span>
                  <span className="block font-semibold text-sm">{r.n}</span>
                  <span className="block text-xs text-muted">{r.r}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface border-y border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <SectionTitle title="Ko'p beriladigan savollar" />
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-xl border border-line overflow-hidden">
                <button
                  type="button"
                  aria-expanded={faq === i}
                  onClick={() => {
                    haptic('select')
                    setFaq(faq === i ? null : i)
                  }}
                  className="w-full flex items-center justify-between text-left px-5 py-4 font-medium hover:bg-sunken"
                >
                  {f.q}
                  <ChevronDown size={18} className={`shrink-0 ml-3 transition ${faq === i ? 'rotate-180' : ''}`} aria-hidden />
                </button>
                {faq === i && <p className="px-5 pb-4 text-muted text-sm leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-3xl bg-brand-600 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Birinchi multfilmingizni bugun yarating</h2>
          <p className="mt-2 text-white/80">Bepul. Bir necha daqiqada. O'zbek tilida.</p>
          <button
            type="button"
            onClick={() => startWithIdea('')}
            className="mt-6 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition inline-flex items-center gap-2"
          >
            <Sparkles size={17} aria-hidden /> Boshlash
          </button>
        </div>
      </section>

      <footer className="border-t border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <p>© {new Date().getFullYear()} Sahna AI · United IT Clubs</p>
          <div className="flex items-center gap-5">
            <button type="button" className="flex items-center gap-1.5 hover:text-brand-600" onClick={() => openExternal(BOT_URL)}>
              <Send size={15} aria-hidden /> @{BOT_USERNAME}
            </button>
            <button type="button" className="hover:text-brand-600" onClick={() => setInfo('privacy')}>
              Maxfiylik
            </button>
            <button type="button" className="hover:text-brand-600" onClick={() => setInfo('contact')}>
              Aloqa
            </button>
          </div>
        </div>
      </footer>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.ex.title} wide>
        {preview && (
          <>
            <VideoPreview scenes={previewScenes} title={preview.ex.sub} seed={preview.seed} autoPlay />
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  const ex = preview.ex
                  setPreview(null)
                  startWithIdea(ex.idea)
                }}
              >
                <Sparkles size={16} aria-hidden /> Shunga o'xshash yaratish
              </Button>
              <Button variant="secondary" onClick={() => setPreview(null)}>
                Yopish
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={info === 'privacy'} onClose={() => setInfo(null)} title="Maxfiylik siyosati">
        <div className="space-y-3 text-sm text-muted leading-relaxed">
          <p>Sahna AI siz kiritgan g'oya va ssenariylarni faqat video tayyorlash uchun ishlatadi.</p>
          <p>Demo rejimida barcha loyihalaringiz faqat shu qurilmada (brauzer xotirasida) saqlanadi va serverga yuborilmaydi.</p>
          <p>Telegram orqali kirganingizda faqat ismingiz va Telegram ID raqamingiz hisobingizni aniqlash uchun ishlatiladi. Ma'lumotlaringiz uchinchi shaxslarga sotilmaydi.</p>
        </div>
      </Modal>
      <Modal open={info === 'contact'} onClose={() => setInfo(null)} title="Aloqa">
        <p className="text-sm text-muted">Savol va takliflaringiz bo'lsa, Telegram orqali yozing — tez javob beramiz.</p>
        <Button className="w-full mt-4" onClick={() => openExternal(BOT_URL)}>
          <Send size={16} aria-hidden /> Telegram'da yozish
        </Button>
      </Modal>
    </div>
  )
}
