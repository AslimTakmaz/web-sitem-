import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createAdminToken, getAdminSecret, isValidPassword } from "../lib/auth.js";

function parsePassword(req: VercelRequest) {
  const raw = req.body;

  if (typeof raw === "string") {
    return (JSON.parse(raw) as { password?: string }).password;
  }

  if (raw && typeof raw === "object") {
    return (raw as { password?: string }).password;
  }

  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    getAdminSecret();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sunucu yapılandırması hatalı";
    return res.status(500).json({ error: message });
  }

  const password = parsePassword(req);

  if (!password || !isValidPassword(password)) {
    return res.status(401).json({ error: "Geçersiz şifre" });
  }

  const token = createAdminToken();
  return res.status(200).json({ token });
}
