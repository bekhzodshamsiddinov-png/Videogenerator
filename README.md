# Sahna AI — Videogenerator

O'zbek tilidagi AI multfilm studiyasi: g'oya → ssenariy → personajlar → storyboard → tayyor video.
Bitta kod bazasi uchta platformada ishlaydi:

| Platforma | Qanday ishlaydi |
|---|---|
| **Veb** (kompyuter) | Oddiy sayt |
| **iOS / Android** | PWA — Safari/Chrome orqali «Bosh ekranga qo'shish», ilova kabi ochiladi (oflayn ham ochiladi) |
| **Telegram** | Mini App — MainButton, BackButton, haptik, Telegram mavzusi, `addToHomeScreen` |

## Holat: demo rejim

Interfeys to'liq ishlaydi, lekin quyidagilar **egasining roziligi / shartnomasi** talab qilgani uchun hali ulanmagan:

- **AI video generatsiya** (Veo / Kling / Wan va h.k.) — pullik API kaliti kerak. Hozir `src/lib/scriptGen.ts` demo ssenariy yozadi, render 12 soniyalik simulyatsiya.
- **To'lovlar** (Click, Payme, Uzum) — merchant shartnomasi kerak. Hozir to'lov oynasi demo, pul yechilmaydi.
- **Telegram bot** — `@BotFather` orqali bot yaratib, tokenni Vercel'ga qo'yish kerak (pastga qarang).
- Ma'lumotlar hozir foydalanuvchi qurilmasida (localStorage) saqlanadi.

## Telegram Mini App ulash

1. `@BotFather` → `/newbot` → token oling.
2. Vercel → Project → Settings → Environment Variables:
   - `TELEGRAM_BOT_TOKEN` = token (**faqat server**, `VITE_` prefiksisiz!)
   - `VITE_TELEGRAM_BOT_USERNAME` = bot nomi (masalan `sahna_ai_bot`)
3. Qayta deploy qiling.
4. `@BotFather` → `/mybots` → Bot Settings → Menu Button / Configure Mini App → sayt manzilini kiriting.

Server `POST /api/telegram-auth` orqali Telegram `initData` imzosini HMAC-SHA256 bilan tekshiradi.

## Ishga tushirish

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc + vite build → dist/
npm test             # unit testlar (vitest)
npm run test:e2e     # e2e testlar: desktop + Android + iPhone (Playwright)
```

## Xavfsizlik

- Qat'iy CSP, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (`vercel.json`)
- Faqat Telegram domenlari Mini App'ni iframe'ga ola oladi (`frame-ancestors`)
- Telegram SDK faqat Telegram ichida yuklanadi — oddiy foydalanuvchilarga uchinchi tomon skripti yo'q
- localStorage ma'lumotlari tip va uzunlik bo'yicha tozalanadi, foydalanuvchi matni HTML sifatida chizilmaydi
- Tashqi havolalar faqat `https://` bo'lsa ochiladi
- Bot token faqat serverda; `npm audit` — 0 zaiflik

## Tuzilma

```
src/
  pages/        Landing, Wizard (5 qadam), Dashboard, Pricing, Profile
  components/   UI, VideoPreview (demo pleyer), Checkout, Header/BottomNav
  lib/          store, storage (tozalash), telegram, pwa, router, scriptGen, share
api/            Vercel funksiyalari: telegram-auth, health
tests/          unit + e2e
```
