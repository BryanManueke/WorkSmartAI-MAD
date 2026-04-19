# 📁 Struktur Folder Proyek WorkSmartAI

## Struktur Akhir

```
FINAL_PROJECT/
│
├── 📱 frontend/                    ← Aplikasi Mobile (Expo React Native)
│   ├── app/                        ← Semua layar aplikasi (Expo Router)
│   │   ├── (tabs)/                 ← Tab utama: dashboard, recommendation, saved, profile
│   │   ├── _layout.tsx             ← Root layout + ConvexProvider
│   │   ├── job-detail.tsx          ← Halaman detail pekerjaan
│   │   ├── category-jobs.tsx       ← Halaman list pekerjaan per kategori
│   │   ├── login.tsx               ← Halaman login
│   │   ├── register.tsx            ← Halaman registrasi
│   │   └── onboarding.tsx          ← Halaman onboarding
│   │
│   ├── convex/                     ← 🗄️ BACKEND (Convex live disini karena satu project)
│   │   ├── schema.ts               ← Definisi tabel database (jobs, users)
│   │   ├── jobs.ts                 ← API fungsi untuk data pekerjaan
│   │   ├── users.ts                ← API fungsi untuk data pengguna
│   │   ├── seed.ts                 ← Script isi data awal database
│   │   └── _generated/             ← AUTO-GENERATED oleh Convex CLI (jangan edit!)
│   │
│   ├── components/                 ← Komponen UI reusable
│   ├── constants/                  ← Data statis (jobs.ts sebagai fallback)
│   ├── hooks/                      ← Custom hooks (useSavedJobsStore, useUserStore)
│   ├── assets/                     ← Gambar dan aset visual
│   ├── .env.local                  ← URL koneksi ke Convex (diisi otomatis)
│   └── package.json                ← Dependensi frontend
│
├── 📄 package.json                 ← Root package (menjalankan frontend dari root)
└── 📖 PANDUAN_STRUKTUR_FOLDER.md   ← Panduan ini
```

---

## ⚠️ Kenapa `convex/` ada di dalam `frontend/`?

Ini adalah **cara yang benar secara teknis**. Convex CLI (`npx convex dev`) bekerja dengan membaca folder `convex/` yang sejajar dengan `package.json` proyek yang menggunakannya. Karena frontend-lah yang menggunakan Convex, maka `convex/` **harus** berada di dalam `frontend/`.

---

## 🚀 Cara Menjalankan

### Terminal 1 — Frontend + Backend sekaligus:
```bash
cd frontend
npx convex dev
```
> Perintah ini menjalankan Convex (backend) **dan** membuat file `_generated/` secara otomatis.

### Terminal 2 — Expo App:
```bash
cd frontend
npm start
```

---

## 📋 Urutan Setup Pertama Kali

1. `cd frontend`
2. `npx convex dev` → login/buat akun Convex, lalu tunggu hingga URL muncul
3. Buka terminal baru → `npm start`
4. Scan QR Code dengan Expo Go

