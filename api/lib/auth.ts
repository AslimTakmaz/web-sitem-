import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest } from "@vercel/node";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

function getAdminSecret() {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? "admin123";
}

export function createAdminToken() {
  const secret = getAdminSecret();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = JSON.stringify({ expiresAt });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url");
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;

  try {
    const secret = getAdminSecret();
    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8"),
    ) as { payload: string; signature: string };

    const expected = createHmac("sha256", secret)
      .update(decoded.payload)
      .digest("hex");

    const validSig = timingSafeEqual(
      Buffer.from(decoded.signature),
      Buffer.from(expected),
    );

    if (!validSig) return false;

    const { expiresAt } = JSON.parse(decoded.payload) as { expiresAt: number };
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export function getBearerToken(req: VercelRequest) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice(7);
}

export function isValidPassword(password: string) {
  return password === getAdminSecret();
}
