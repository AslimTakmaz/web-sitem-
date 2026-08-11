import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const personalPath = join(root, "src/data/personal.ts");
const publicDir = join(root, "public");

const source = readFileSync(personalPath, "utf8");
const match = source.match(/siteUrl:\s*"([^"]+)"/);

if (!match) {
  console.error("personal.ts içinde siteUrl bulunamadı.");
  process.exit(1);
}

const siteUrl = match[1].replace(/\/$/, "");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(publicDir, "sitemap.xml"), sitemap);
writeFileSync(join(publicDir, "robots.txt"), robots);
console.log(`SEO dosyaları oluşturuldu: ${siteUrl}`);
