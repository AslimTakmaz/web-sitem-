import type { VercelRequest, VercelResponse } from "@vercel/node";
import { appendContactMessage } from "./lib/contentStore.js";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body: Record<string, unknown>;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as Record<string, unknown>);
  } catch {
    return res.status(400).json({ error: "Geçersiz istek gövdesi" });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Geçerli bir ad girin." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Geçerli bir e-posta adresi girin." });
  }

  if (!subject || subject.length < 2) {
    return res.status(400).json({ error: "Konu en az 2 karakter olmalı." });
  }

  if (!message || message.length < 10) {
    return res.status(400).json({ error: "Mesaj en az 10 karakter olmalı." });
  }

  if (name.length > 120 || email.length > 200 || subject.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: "Mesaj çok uzun." });
  }

  try {
    await appendContactMessage({ name, email, subject, message });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Mesaj gönderilemedi. Lütfen tekrar deneyin." });
  }
}
