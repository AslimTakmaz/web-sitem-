import type { SiteContent } from "../types/siteContent";

export const defaultContent: SiteContent = {
  personal: {
    name: "Aslım Takmaz",
    siteUrl: "https://aslimtakmaz-websitem.vercel.app",
    title: "Software Development Intern",
    tagline:
      "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.",
    statusLine: "Staj ve iş birliği fırsatlarına açığım",
    cvUrl: "",
    social: {
      github: "https://github.com/AslimTakmaz",
      linkedin:
        "https://www.linkedin.com/in/asl%C4%B1m-takmaz-38a199390/",
    },
    contact: {
      email: "takmazaslim096@gmail.com",
    },
    generalExtras: [],
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
      extras: [],
    },
  },
  projects: [
    {
      id: "stajyer-takip-paneli",
      name: "Stajyer Takip Paneli",
      description:
        "Stajyerlerin günlük çalışmalarını ve süreçlerini takip etmek amacıyla geliştirilmiş web tabanlı bir stajyer takip paneli.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      features: [
        "Kullanıcı giriş sistemi",
        "Admin paneli",
        "Stajyer paneli",
        "Günlük çalışma kaydı",
        "Stajyer takibi",
        "Veritabanı",
        "Responsive tasarım",
      ],
      published: true,
      links: {
        github: "https://github.com/kullaniciadi/stajyer-takip-paneli",
        demo: "#",
      },
    },
    {
      id: "kisisel-portfolio",
      name: "Portföy Web Sitesi",
      description:
        "Yazılım geliştirme yolculuğumu, projelerimi ve iletişim kanallarımı sergileyen modern ve responsive kişisel portföy sitesi.",
      technologies: ["React", "TypeScript", "Vite", "CSS Modules"],
      features: [
        "Koyu / açık tema",
        "Responsive tasarım",
        "SEO ve Google Search Console",
        "Proje vitrin alanı",
        "İletişim bölümü",
        "Vercel deploy",
      ],
      published: true,
      links: {
        github: "https://github.com/AslimTakmaz/web-sitem-",
      },
    },
  ],
  skills: [
    { id: "skill-react", name: "React", category: "frontend", level: "using" },
    { id: "skill-ts", name: "TypeScript", category: "frontend", level: "using" },
    { id: "skill-next", name: "Next.js", category: "frontend", level: "learning" },
    { id: "skill-tailwind", name: "Tailwind CSS", category: "frontend", level: "using" },
    { id: "skill-node", name: "Node.js", category: "backend", level: "learning" },
    { id: "skill-sqlite", name: "SQLite", category: "database", level: "using" },
  ],
  experiences: [
    {
      id: "exp-education",
      title: "Bilişim Teknologileri Öğrencisi",
      organization: "Lise Eğitimi",
      period: "2023 – Devam ediyor",
      description:
        "Web geliştirme, proje geliştirme ve yapay zekâ destekli araçlar üzerine çalışmalar yapıyorum.",
    },
  ],
  seo: {
    title: "Aslım Takmaz — Software Development Intern",
    description:
      "Aslım Takmaz — Software Development Intern. Modern web teknolojileri ile kullanıcı odaklı web uygulamaları geliştiriyorum.",
    keywords: "Aslım Takmaz, yazılım geliştirici, portföy, React, TypeScript",
  },
  theme: {
    dark: {
      accent: "#2dd4bf",
      accentHover: "#14b8a6",
      babyBlue: "#5eead4",
      label: "#5eead4",
    },
    light: {
      accent: "#0d9488",
      accentHover: "#0f766e",
      babyBlue: "#14b8a6",
      label: "#0d9488",
    },
  },
};
