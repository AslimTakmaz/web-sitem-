import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ContactMessage } from "../../src/types/siteContent";
import { getBearerToken, verifyAdminToken } from "../lib/auth.js";
import { loadMessages, loadSiteContent, saveMessages } from "../lib/contentStore.js";

function parseMessagesBody(req: VercelRequest): ContactMessage[] {
  const raw = req.body;
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (!data || typeof data !== "object") {
    throw new Error("Geçersiz istek gövdesi");
  }

  const messages = (data as { messages?: unknown }).messages;
  if (!Array.isArray(messages)) {
    throw new Error("messages dizisi gerekli");
  }

  return messages as ContactMessage[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getBearerToken(req);

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  if (req.method === "GET") {
    try {
      // Önce ayrı mesaj dosyası; yoksa site içeriğindeki eski mesajlara düş
      let messages = await loadMessages();
      if (messages.length === 0) {
        const { content } = await loadSiteContent();
        messages = await loadMessages(content.messages ?? []);
      }
      res.setHeader("Cache-Control", "no-store, max-age=0");
      return res.status(200).json({ messages });
    } catch {
      return res.status(500).json({ error: "Mesajlar yüklenemedi" });
    }
  }

  if (req.method === "PUT") {
    try {
      const messages = parseMessagesBody(req);
      const saved = await saveMessages(messages);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ messages: saved });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kayıt başarısız";
      return res.status(500).json({ error: message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
