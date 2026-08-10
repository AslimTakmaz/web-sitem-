/**
 * Kişisel bilgilerinizi bu dosyadan düzenleyebilirsiniz.
 * Tüm site bu dosyadaki verileri kullanır.
 */

export const personal = {
  name: "Aslım Takmaz",
  title: "Software Development Intern",
  tagline:
    "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.",

  social: {
    github: "https://github.com/AslimTakmaz",
    linkedin: "https://www.linkedin.com/in/asl%C4%B1m-takmaz-38a199390/",
  },

  contact: {
    email: "takmazaslim096@gmail.com",
  },

  about: {
    bio: "Teknoloji dünyasına Software Development Intern olarak adım atan ve sürekli öğrenmeye odaklanan bir yazılım geliştiriciyim. İlk projemi başarıyla tamamlayıp yayına aldıktan sonra, şu an kendimi daha da geliştirmek adına ikinci projem üzerinde aktif olarak çalışıyorum. Yeni teknolojileri öğrenmeye ve sektörel deneyim kazanmaya hazırım.",
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
