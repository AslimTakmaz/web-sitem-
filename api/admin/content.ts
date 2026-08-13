import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { SiteContent } from "../../src/types/siteContent";
import { getBearerToken, verifyAdminToken } from "../lib/auth.js";
import { loadSiteContent, saveSiteContent } from "../lib/contentStore.js";
import { normalizeContent } from "../lib/normalizeContent.js";

function parseSiteContentBody(req: VercelRequest): SiteContent {
  const raw = req.body;

  if (typeof raw === "string") {
    return JSON.parse(raw) as SiteContent;
  }

  if (raw && typeof raw === "object") {
    return raw as SiteContent;
  }

  throw new Error("Geçersiz kayıt verisi");
}

function assertTheme(content: SiteContent) {
  if (!content?.theme?.dark?.accent || !content?.theme?.light?.accent) {
    throw new Error("Tema verisi eksik");
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getBearerToken(req);

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  if (req.method === "GET") {
    try {
      const content = await loadSiteContent();
      res.setHeader("Cache-Control", "no-store, max-age=0");
      return res.status(200).json(content);
    } catch {
      return res.status(500).json({ error: "İçerik yüklenemedi" });
    }
  }

  if (req.method === "PUT") {
    try {
      const parsed = parseSiteContentBody(req);
      assertTheme(parsed);
      const content = normalizeContent(parsed);
      const saved = await saveSiteContent(content);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(saved);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kayıt başarısız";
      return res.status(500).json({ error: message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
