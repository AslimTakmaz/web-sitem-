/**
 * Kişisel bilgilerinizi bu dosyadan düzenleyebilirsiniz.
 * Tüm site bu dosyadaki verileri kullanır.
 */

export const personal = {
  name: "AD SOYAD",
  title: "Software Developer",
  tagline:
    "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.",

  social: {
    github: "https://github.com/kullaniciadi",
    linkedin: "https://linkedin.com/in/kullaniciadi",
  },

  contact: {
    email: "ornek@email.com",
  },

  about: {
    bio: "[Buraya kısa biyografi eklenecek]",
    interest: "[Yazılıma olan ilginizi buraya yazın]",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "[Teknoloji ekleyin]",
    ],
    focusAreas: [
      "[Geliştirdiğiniz alan 1]",
      "[Geliştirdiğiniz alan 2]",
      "[Geliştirdiğiniz alan 3]",
    ],
    education: "[Eğitim bilgilerinizi buraya ekleyin]",
  },
} as const;
