# WorkSmartAI 🚀

**Platform Pencarian Kerja Cerdas Berbasis Kecerdasan Buatan (AI)**

WorkSmartAI adalah aplikasi *mobile* yang menggunakan **Google Gemini AI** untuk menganalisis profil Anda dan memberikan rekomendasi pekerjaan yang paling cocok (beserta skor persentase) secara *real-time*.

## ✨ Fitur Utama
- **AI Job Matching**: Menganalisis keahlian (skills) dan memberikan skor kecocokan spesifik (0-100%).
- **AI Chat Advisor**: Asisten virtual pintar untuk tips karir dan panduan lamaran kerja.
- **Real-time Database**: Semua data (Lowongan, Profil, Riwayat Chat) tersinkronisasi instan.
- **Resume Generator**: Buat dan lihat ringkasan CV Anda dengan mudah.
- **Terintegrasi Penuh**: Bisa langsung hubungi HRD via WhatsApp/Email dengan menyertakan skor AI Anda.

## 🛠️ Teknologi (Tech Stack)
- **Frontend**: React Native, Expo, NativeWind
- **Backend & DB**: Convex (Real-time NoSQL)
- **Kecerdasan Buatan**: Google Gemini AI
- **Bahasa**: TypeScript

## 🚀 Cara Menjalankan Aplikasi

**1. Persiapan**
Buat file `.env.local` dan masukkan kunci berikut:
```env
GEMINI_API_KEY=Kunci_Gemini_Anda
EXPO_PUBLIC_CONVEX_URL=URL_Convex_Anda
```

**2. Instal & Jalankan**
Buka terminal dan jalankan perintah ini secara berurutan:
```bash
npm install        # Instal dependensi
npx convex dev     # Jalankan Backend (Terminal 1)
npm start          # Jalankan Frontend (Terminal 2)
```
*Gunakan aplikasi Expo Go di HP Anda untuk menscan QR Code.*
