# 📁 Struktur Folder Proyek WorkSmartAI

## Struktur Akhir

```
FINAL_PROJECT/
│
├── app/                        ← Semua layar aplikasi (Expo Router)
│   ├── (tabs)/                 ← Tab utama: dashboard, recommendation, saved, profile
│   ├── _layout.tsx             ← Root layout + ConvexProvider
│   ├── job-detail.tsx          ← Halaman detail pekerjaan
│   ├── category-jobs.tsx       ← Halaman list pekerjaan per kategori
│   ├── login.tsx               ← Halaman login
│   ├── register.tsx            ← Halaman registrasi
│   └── setup-profile.tsx       ← Halaman setup profil
│
├── convex/                     ← 🗄️ BACKEND (Convex)
│   ├── schema.ts               ← Definisi tabel database
│   ├── jobs.ts                 ← API fungsi pekerjaan
│   └── _generated/             ← AUTO-GENERATED
│
├── components/                 ← Komponen UI reusable
├── constants/                  ← Data statis
├── hooks/                      ← Custom hooks
├── assets/                     ← Gambar dan aset
├── .env.local                  ← URL koneksi Convex
├── package.json                ← Dependensi Proyek
└── README.md                   ← Panduan ini
```

---

## ⚠️ Kenapa `convex/` ada di dalam `frontend/`?

Ini adalah **cara yang benar secara teknis**. Convex CLI (`npx convex dev`) bekerja dengan membaca folder `convex/` yang sejajar dengan `package.json` proyek yang menggunakannya. Karena frontend-lah yang menggunakan Convex, maka `convex/` **harus** berada di dalam `frontend/`.

---

## 🚀 Cara Menjalankan

### Terminal 1 — Backend (Convex):
```bash
npx convex dev
```

### Terminal 2 — Frontend (Expo):
```bash
npm start
```

---

## 📋 Urutan Setup Pertama Kali

1. `npx convex dev` → login/buat akun Convex, lalu tunggu hingga URL muncul
2. Buka terminal baru → `npm start`
3. Scan QR Code dengan Expo Go
