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

## GitHub'a Push

### 1. GitHub'da repo oluştur

1. https://github.com/new adresine git
2. Repository name: `portfolio` (veya istediğin isim)
3. **Public** seç
4. "Add a README file" **işaretleme** (zaten kodumuz var)
5. **Create repository** tıkla

### 2. Terminalden push et

```bash
./scripts/push-github.sh GITHUB_KULLANICI_ADIN portfolio
```

Manuel yapmak istersen:

```bash
git remote add origin https://github.com/GITHUB_KULLANICI_ADIN/portfolio.git
git push -u origin main
```

## Vercel'de Canlıya Alma

### Yöntem 1 — GitHub bağlantısı (önerilen)

1. https://vercel.com adresine git, GitHub ile giriş yap
2. **Add New → Project**
3. Az önce push ettiğin `portfolio` reposunu seç
4. Ayarlar otomatik gelir (Vite algılanır), **Deploy** tıkla
5. 1-2 dakika sonra `https://portfolio-xxx.vercel.app` gibi bir link alırsın

Her `git push` yaptığında site otomatik güncellenir.

### Yöntem 2 — Vercel CLI

```bash
npx vercel login
npx vercel --prod
```

## Teknolojiler

- React + TypeScript
- Vite
- CSS Modules
