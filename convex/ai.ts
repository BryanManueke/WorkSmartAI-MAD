import { action } from "./_generated/server";
import { v } from "convex/values";


export const chat = action({
  args: { 
    message: v.string(), 
    history: v.optional(v.array(v.object({ sender: v.string(), text: v.string() }))),
    userProfile: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return "Maaf, WorkSmart AI sedang tidak tersedia (API Key belum dikonfigurasi). Silakan hubungi admin.";
    }

    const systemPrompt = `Kamu adalah WorkSmart AI Advisor, asisten karir cerdas untuk pengguna di Indonesia, khususnya daerah Sulawesi Utara. 
    Tugasmu:
    1. Memberikan saran karir yang profesional dan menyemangati.
    2. Memberikan tips interview dan penulisan resume.
    3. Jika ada data profil user, gunakan data tersebut untuk memberikan saran yang lebih personal.
    
    Data Profil User (jika tersedia): ${JSON.stringify(args.userProfile || {})}
    
    Jawablah dalam Bahasa Indonesia yang sopan dan informatif.`;

    const chatHistory = (args.history || [])
      .filter(h => h.text && h.text.trim().length > 0)
      .map(h => ({
        role: h.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: systemPrompt }] },
              { role: "model", parts: [{ text: "Siap, saya adalah WorkSmart AI Advisor. Ada yang bisa saya bantu?" }] },
              ...chatHistory,
              { role: "user", parts: [{ text: args.message }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          }),
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return "Maaf, saya sedang kesulitan memproses permintaanmu. Bisa ulangi lagi?";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return "Terjadi kesalahan koneksi dengan otak AI saya. Coba lagi nanti ya!";
    }
  },
});

export const analyzeResume = action({
  args: { 
    resumeData: v.any()
  },
  handler: async (ctx, args) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return "API Key tidak ditemukan.";

    const prompt = `Analisis data resume berikut dan berikan feedback profesional:
    ${JSON.stringify(args.resumeData)}
    
    Berikan output dalam format:
    1. Ringkasan singkat profil.
    2. Kekuatan utama (poin-poin).
    3. Area yang perlu ditingkatkan (poin-poin).
    4. Rekomendasi 3 peran pekerjaan yang paling cocok.
    
    Gunakan Bahasa Indonesia yang profesional.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      return "Gagal menganalisis resume.";
    }
  },
});

export const rankJobs = action({
  args: { 
    userProfile: v.any(),
    jobs: v.array(v.any())
  },
  handler: async (ctx, args) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return args.jobs.map(j => ({ ...j, matchScore: 0 }));

    const prompt = `Analisis kecocokan antara user dan daftar lowongan kerja berikut.
    
    User Profile:
    ${JSON.stringify(args.userProfile)}
    
    Daftar Lowongan:
    ${JSON.stringify(args.jobs.map(j => ({ id: j._id, title: j.title, category: j.category, requirements: j.requirements })))}
    
    Tugas:
    Berikan skor kecocokan (0-100) untuk setiap lowongan berdasarkan keahlian dan pengalaman user.
    Kembalikan hasil dalam format JSON array saja: [{"id": "...", "score": 85, "reason": "..."}]`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const rankings = JSON.parse(text);
      
      return args.jobs.map(job => {
        const ranking = rankings.find((r: any) => r.id === job._id);
        return {
          ...job,
          matchScore: ranking ? ranking.score : 0,
          matchReason: ranking ? ranking.reason : ""
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

    } catch (error) {
      console.error(error);
      return args.jobs.map(j => ({ ...j, matchScore: 0 }));
    }
  },
});
