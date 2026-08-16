import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadSiteContent } from "./lib/contentStore.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { content } = await loadSiteContent();
    // Public API: taslak projeleri gizle, mesajları asla sızdırma
    const publicContent = {
      ...content,
      projects: (content.projects ?? []).filter((project) => project.published !== false),
      messages: [],
    };
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json(publicContent);
  } catch {
    return res.status(500).json({ error: "İçerik yüklenemedi" });
  }
}
