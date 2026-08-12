import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createAdminToken, isValidPassword } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body as { password?: string };

  if (!password || !isValidPassword(password)) {
    return res.status(401).json({ error: "Geçersiz şifre" });
  }

  const token = createAdminToken();
  return res.status(200).json({ token });
}
