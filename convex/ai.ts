import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


export const chat = action({
  args: { 
    message: v.string(), 
    history: v.optional(v.array(v.object({ sender: v.string(), text: v.string() }))),
    userProfile: v.optional(v.any())
  },
  handler: async (ctx, args): Promise<string> => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return "Maaf, WorkSmart AI sedang tidak tersedia (API Key belum dikonfigurasi). Silakan hubungi admin.";
    }

    // Ambil data pekerjaan dari database untuk direkomendasikan AI
    const jobs = await ctx.runQuery(api.jobs.listAll);
    const availableJobs = jobs.map((j: any) => ({
       title: j.title,
       company: j.company,
       category: j.category,
       location: j.location,
       type: j.type,
       salary: j.salary,
       requirements: j.requirements
    }));

    const systemPrompt = `Kamu adalah WorkSmart AI Advisor, asisten karir cerdas untuk pengguna di Indonesia, khususnya daerah Sulawesi Utara. 
    Tugasmu:
    1. Memberikan saran karir yang profesional dan menyemangati.
    2. Memberikan tips interview dan penulisan resume.
    3. Jika user menanyakan rekomendasi lowongan kerja, gunakan "Data Lowongan Pekerjaan" di bawah ini.
    4. JANGAN merekomendasikan pekerjaan fiktif atau yang tidak ada di daftar.
    
    ATURAN FORMATTING SANGAT PENTING:
    - JANGAN PERNAH menggunakan simbol markdown seperti **, *, atau # dalam balasanmu.
    - Gunakan penomoran biasa (1., 2., 3.) atau strip (-) untuk daftar.
    - Gunakan Huruf Kapital untuk penekanan kata, JANGAN gunakan simbol bintang atau bold.
    - SATU-SATUNYA format khusus yang diizinkan adalah tautan rekomendasi pekerjaan: [Nama Pekerjaan](/job-detail?id=ID)
    
    Data Profil User: ${JSON.stringify(args.userProfile || {})}
    
    Data Lowongan Pekerjaan (Tersedia di Aplikasi): ${JSON.stringify(availableJobs)}
    
    Jawablah dalam Bahasa Indonesia yang sopan, rapi, dan terstruktur tanpa simbol-simbol aneh.`;

    const chatHistory = (args.history || [])
      .filter(h => h.text && h.text.trim().length > 0)
      .map(h => ({
        role: h.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

    const rawContents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Siap, saya adalah WorkSmart AI Advisor. Ada yang bisa saya bantu?" }] },
      ...chatHistory,
      { role: "user", parts: [{ text: args.message }] }
    ];

    const contents = rawContents.reduce((acc: any[], curr: any) => {
      if (acc.length > 0 && acc[acc.length - 1].role === curr.role) {
        acc[acc.length - 1].parts[0].text += "\n\n" + curr.parts[0].text;
      } else {
        acc.push({ role: curr.role, parts: [{ text: curr.parts[0].text }] });
      }
      return acc;
    }, []);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API Error:", response.status, data);
        return `Maaf, ada masalah dengan API Gemini: ${data?.error?.message || 'Unknown Error'}`;
      }
      
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
  handler: async (ctx, args): Promise<string> => {
    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) return "API Key tidak ditemukan.";

      const jobs = await ctx.runQuery(api.jobs.listAll);
      const availableJobs = jobs.map((j: any) => ({
         id: j._id,
         title: j.title,
         company: j.company,
      }));

      const prompt = `Analisis data resume berikut dan berikan feedback profesional:
      ${JSON.stringify(args.resumeData)}
      
      Data Lowongan Pekerjaan yang Tersedia di Aplikasi:
      ${JSON.stringify(availableJobs)}
      
      ATURAN FORMATTING SANGAT PENTING:
      1. JANGAN PERNAH menggunakan simbol markdown seperti **, *, atau # sama sekali.
      2. Tuliskan teks secara rapi menggunakan nomor urut biasa (1., 2., 3.) tanpa embel-embel simbol.
      3. Gunakan Huruf Kapital untuk memberikan penekanan kata (jangan gunakan bold/asterisk).
      
      Berikan output dengan struktur yang persis seperti ini:
      1. Ringkasan Singkat Profil
      2. Kekuatan Utama
      3. Area yang Perlu Ditingkatkan
      4. Rekomendasi Pekerjaan
      
      PENTING UNTUK REKOMENDASI: Untuk setiap rekomendasi pekerjaan yang kamu temukan cocok dari data di atas, kamu WAJIB memberikan tautan yang dapat diklik dengan format persis seperti ini (ini satu-satunya simbol kurung yang diizinkan):
      [Nama Pekerjaan di Nama Perusahaan](/job-detail?id=ID_PEKERJAAN)
      Contoh: [Frontend Developer di Tech Indo](/job-detail?id=xyz123)
      
      Gunakan Bahasa Indonesia yang profesional, sangat rapi, dan mudah dibaca di layar HP.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API Error:", response.status, data);
        return `Gagal menganalisis resume (API Error: ${data?.error?.message || 'Unknown'}).`;
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return "Maaf, hasil analisis kosong. Coba lagi.";
    } catch (error: any) {
      console.error("Analyze Resume Exception:", error);
      return `Gagal menganalisis resume: ${error.message}`;
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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

export const getMessages = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return messages;
  },
});

export const saveMessage = mutation({
  args: {
    userId: v.id("users"),
    text: v.string(),
    sender: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", {
      userId: args.userId,
      text: args.text,
      sender: args.sender,
    });
  },
});

export const clearMessages = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
      
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});

