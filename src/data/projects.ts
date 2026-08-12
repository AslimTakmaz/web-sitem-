/**
 * Projelerinizi bu dosyadan düzenleyebilirsiniz.
 * Yeni proje eklemek için projects dizisine yeni bir obje eklemeniz yeterli.
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  features: string[];
  status?: "completed" | "in-progress";
  links: {
    github?: string;
    demo?: string;
  };
}

export const projects: Project[] = [
  {
    id: "stajyer-takip-paneli",
    name: "Stajyer Takip Paneli",
    description:
      "Stajyerlerin günlük çalışmalarını ve süreçlerini takip etmek amacıyla geliştirilmiş web tabanlı bir stajyer takip paneli.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
    ],
    features: [
      "Kullanıcı giriş sistemi",
      "Admin paneli",
      "Stajyer paneli",
      "Günlük çalışma kaydı",
      "Stajyer takibi",
      "Veritabanı",
      "Responsive tasarım",
    ],
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
    links: {
      github: "https://github.com/AslimTakmaz/web-sitem-",
    },
  },
];
