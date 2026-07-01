# Nihongo Random

Ứng dụng web miễn phí học tiếng Nhật trình độ **JLPT N5**, dựa trên giáo trình *Minna no Nihongo*. Giao diện tiếng Việt.

## Tính năng

- **Quiz phản xạ** — Hiragana/Katakana, từ vựng, Kanji, số đếm và giờ; có confetti và phím tắt.
- **Nội dung bài học có cấu trúc** — 25 bài, mỗi bài 11 phần (từ vựng, ngữ pháp, luyện nghe, …), render từ JSON đã xử lý sẵn.

Không có đăng nhập, không có cơ sở dữ liệu người dùng. Backend duy nhất là Firebase Realtime Database cho bộ đếm "người đang online" — và **hoàn toàn tuỳ chọn**; app chạy đủ chức năng khi thiếu nó.

## Tech stack

- Next.js 16 (App Router, SSG) · React 19 · TypeScript 5 (strict)
- Tailwind CSS 4 (CSS-first, `@theme` trong `globals.css`)
- `@headlessui/react`, `canvas-confetti`, Web Speech API
- Firebase 12 (Realtime Database, tuỳ chọn) · Hosting: Vercel

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # tuỳ chọn: điền Firebase nếu muốn bật presence
npm run dev                  # http://localhost:3000
```

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production (cổng CI) |
| `npm run start` | Phục vụ bản build |
| `npm run lint` | ESLint |

## Cấu trúc thư mục

```
src/
├── app/          App Router routes, layout, globals.css, sitemap/robots
├── components/   layouts · modules (theo trang) · shared (tái dùng)
├── hooks/        React hooks
├── lib/          Data access + domain logic (n5Lesson, n5Types, firebase, …)
├── utils/        Helper thuần, không side-effect
├── config/       Dataset tĩnh (kana/số)
└── data/n5/      Nội dung giáo trình (JSON theo bài/phần)
```

## Môi trường

Xem `.env.example`. Mọi biến là `NEXT_PUBLIC_*` (công khai theo thiết kế client SDK). Thiếu cấu hình Firebase → tính năng presence tự tắt, phần còn lại hoạt động bình thường.
