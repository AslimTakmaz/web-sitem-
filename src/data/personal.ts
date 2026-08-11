/**
 * Kişisel bilgilerinizi bu dosyadan düzenleyebilirsiniz.
 * Tüm site bu dosyadaki verileri kullanır.
 */

export const personal = {
  name: "Aslım Takmaz",
  /** Google SEO — canlı site linkin (Vercel veya özel domain) */
  siteUrl: "https://aslimtakmaz-websitem.vercel.app",
  logoSubtitle: "Developer Portfolio",
  title: "Software Development Intern",
  tagline:
    "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.",

  social: {
    github: "https://github.com/AslimTakmaz",
    linkedin: "https://www.linkedin.com/in/asl%C4%B1m-takmaz-38a199390/",
  },

  contact: {
    email: "takmazaslim096@gmail.com",
    /**
     * Web3Forms Access Key — https://web3forms.com
     * E-postanı gir, gelen anahtarı buraya yapıştır.
     */
    web3formsAccessKey: "",
  },

  about: {
    bio: "Teknoloji dünyasına Software Development Intern olarak adım atan ve sürekli öğrenmeye odaklanan bir yazılım geliştiriciyim. İlk projemi başarıyla tamamlayıp yayına aldıktan sonra, şu an kendimi daha da geliştirmek adına ikinci projem üzerinde aktif olarak çalışıyorum. Yeni teknolojileri öğrenmeye ve sektörel deneyim kazanmaya hazırım.",
    interest:
      "Yazılıma olan ilgimi projeler geliştirerek ilerletiyorum. Kodlama bilgim başlangıç seviyesinde olsa da, yapay zekâ destekli araçları kullanarak Stajyer Takip Paneli geliştirdim ve şu anda kendi portföy web sitem üzerinde çalışıyorum.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "SQLite",
    ],
    focusAreas: [
      "Web Geliştirme",
      "Proje Geliştirme",
      "Yapay Zekâ Destekli Geliştirme",
      "UI/UX Tasarımı",
    ],
    education: {
      title: "11. Sınıf Bilişim Teknologileri Öğrencisi",
      period: "2023 – Devam ediyor",
      description:
        "Bilişim ve yazılım alanında kendimi geliştiriyor, öğrendiklerimi gerçek projelere dönüştürüyorum. Web geliştirme, proje geliştirme ve yapay zekâ destekli araçlar üzerine çalışmalar yapıyorum.",
    },
  },
} as const;
