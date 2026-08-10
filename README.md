# Kişisel Portföy Web Sitesi

Modern, koyu temalı ve responsive kişisel portföy sitesi.

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## Production Build

```bash
npm run build
npm run preview
```

## Kişisel Bilgileri Düzenleme

| Ne değiştirmek istiyorsunuz? | Dosya |
|---|---|
| İsim, unvan, tanım, sosyal medya, iletişim, hakkımda | `src/data/personal.ts` |
| Projeler | `src/data/projects.ts` |
| Sayfa başlığı ve SEO | `index.html` |

### `src/data/personal.ts`

- `name` → İsminiz
- `title` → Unvanınız (ör. Software Developer)
- `tagline` → Ana sayfadaki kısa açıklama
- `social.github` / `social.linkedin` → Sosyal medya linkleri
- `contact.email` → E-posta adresiniz
- `about` → Hakkımda bölümündeki tüm metinler

### `src/data/projects.ts`

Yeni proje eklemek için `projects` dizisine yeni bir obje ekleyin. Mevcut `Stajyer Takip Paneli` örneğini referans alın.

## Teknolojiler

- React + TypeScript
- Vite
- CSS Modules
