# Panduan Struktur Folder Proyek (WorkSmartAI)

Proyek ini telah direstrukturisasi secara penuh menjadi **Monorepo** untuk memisahkan Frontend dan Backend agar Anda tidak bingung secara visual.

Silakan pelajari struktur barunya:

### 📱 1. `frontend/` (Aplikasi React Native Expo)
Folder ini murni hanya berisi semua tampilan aplikasi mobile (Frontend) yang dilihat oleh pengguna.
- `app/` : Routing aplikasi Anda (Halaman layar seperti Login, Dashboard, dll).
- `components/` : Tempat menyimpan "potongan kodingan visual UI" (seperti Tombol, Kartu Pekerjaan). *Sekarang sepenuhnya ada di area Frontend.*
- `package.json` : File pendukung khusus untuk frontend.
👉 **Cara Menjalankan Frontend:**
1. Masuk ke folder terminal via `cd frontend`
2. Jalankan `npm start`

### ⚙️ 2. `backend/` (Database & Serverless AI Convex)
Folder ini murni menyimpan Database dan Logika Sistem Server Backend utama Anda.
- `convex/schema.ts` : Konfigurasi tabel database relasi Anda.
- Tempat Anda membuat logika API dan penggabungan dengan AI (misal `convex/ai.ts`).
👉 **Cara Menjalankan Backend:**
1. Buka satu terminal baru.
2. Masuk ke folder terminal via `cd backend`
3. Jalankan `npx convex dev`

---
**Kesimpulan**: Antara Frontend (Mobile App / UI) dan Backend (Database Convex / AI) sekarang **sudah 100% dipisah** ke folder eksklusifnya masing-masing. Mata Anda tidak akan lagi tertipu oleh tampilan penumpukan file!
