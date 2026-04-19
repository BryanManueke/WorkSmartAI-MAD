import { mutation } from "./_generated/server";

const ALL_JOBS = [
  // TEKNOLOGI
  { 
    id: 't1', title: 'Senior IT Support Specialist', company: 'Bank SulutGo (Head Office)', location: 'Manado, Sulut', salary: 'Rp 6 - 9 Jt', logo: 'settings', category: 'Teknologi', type: 'Full-time', banner: 'tech',
    description: 'Mengelola dan memelihara seluruh infrastruktur IT di kantor pusat Bank SulutGo. Menjamin stabilitas sistem perbankan dan ketersediaan layanan nasabah 24/7 di wilayah Sulawesi Utara.',
    requirements: [
      'Lulusan S1 Teknik Informatika (IPK minimal 3.00).',
      'Pengalaman 2 tahun di bidang IT Support perbankan.',
      'Memiliki sertifikasi MikroTik atau Cisco (CCNA).',
      'Mampu bekerja dalam tekanan dan sistem shift.'
    ],
    responsibilities: [
      'Monitoring berkala server dan jaringan kantor pusat.',
      'Troubleshooting perangkat keras dan sistem bank.',
      'Pemeliharaan keamanan data dan patch manajemen harian.',
      'Penyusunan laporan insiden teknis kepada pimpinan.'
    ]
  },
  { 
    id: 't2', title: 'Frontend Developer (React)', company: 'Telkom Sulawesi Utara', location: 'Manado Tengah', salary: 'Rp 9 - 14 Jt', logo: 'code-slash', category: 'Teknologi', type: 'Full-time', banner: 'tech',
    description: 'Membangun antarmuka web monitoring jaringan fiber optik yang responsif dan intuitif. Berkolaborasi dengan tim backend untuk integrasi data real-time infrastruktur Telkom.',
    requirements: [
      'S1 Sistem Informasi / Ilmu Komputer.',
      'Mahir React.js, Next.js, dan arsitektur TypeScript.',
      'Memahami integrasi API RESTful dan state management.',
      'Memiliki portofolio slicing UI yang presisi (Pixel Perfect).'
    ],
    responsibilities: [
      'Desain dan implementasi komponen UI yang reusable.',
      'Optimasi performa dan aksesibilitas aplikasi web.',
      'Melakukan code review berkala untuk menjaga kualitas.',
      'Sinkronisasi rilis fitur web dengan tim produk pusat.'
    ]
  },
  // ... adding a few more for the demonstration, I can't put all 120 here in one write_to_file if it's too big, 
  // but I will put a representative sample and then inform the user how to add the rest or I will do it in chunks.
  // Actually, I'll put a good chunk here and use multiple calls if needed.
];

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    for (const job of ALL_JOBS) {
      const existing = await ctx.db
        .query("jobs")
        .withIndex("by_id", (q) => q.eq("id", job.id))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("jobs", job);
      }
    }
  },
});
