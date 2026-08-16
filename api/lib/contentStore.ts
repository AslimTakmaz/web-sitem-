import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getVercelOidcToken } from "@vercel/oidc";
import { get, head, put } from "@vercel/blob";
import type { ContactMessage, SiteContent } from "../../src/types/siteContent";
import { normalizeContent } from "./normalizeContent.js";

const BLOB_PATHNAME = "portfolio/site-content.json";
const MESSAGES_PATHNAME = "portfolio/contact-messages.json";
const ACCESS_MODES = ["private", "public"] as const;
const MAX_MESSAGES = 100;

type BlobAccess = (typeof ACCESS_MODES)[number];

type BlobAuthOptions = {
  token?: string;
  oidcToken?: string;
  storeId?: string;
};

let resolvedAccess: BlobAccess | null = null;

function normalizeStoreId(storeId: string) {
  return storeId.startsWith("store_") ? storeId.slice("store_".length) : storeId;
}

function parseStoreIdFromToken(token: string) {
  const [, , , storeId = ""] = token.split("_");
  return storeId;
}

function tokenMatchesStore(token: string, storeId: string) {
  return parseStoreIdFromToken(token) === normalizeStoreId(storeId);
}

function getConfiguredAccess(): BlobAccess | null {
  const value = process.env.BLOB_STORE_ACCESS?.trim();
  if (value === "private" || value === "public") {
    return value;
  }
  return null;
}

async function resolveBlobAuthOptions(): Promise<BlobAuthOptions> {
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const rwToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (storeId) {
    try {
      const oidcToken = (await getVercelOidcToken()).trim();
      if (oidcToken) {
        return { oidcToken, storeId };
      }
    } catch {
      // OIDC kullanılamıyorsa store'a ait read-write token dene
    }

    if (rwToken && tokenMatchesStore(rwToken, storeId)) {
      return { token: rwToken };
    }

    throw new Error(
      "Blob kimlik doğrulaması başarısız. Vercel → Settings → Environment Variables içindeki BLOB_READ_WRITE_TOKEN değerini silin, Storage → Blob store'un projeye bağlı olduğundan emin olun ve redeploy edin.",
    );
  }

  if (rwToken) {
    return { token: rwToken };
  }

  throw new Error(
    "Blob bağlantısı yok. Vercel'de Storage → Blob store'u projeye bağlayın veya geçerli BLOB_READ_WRITE_TOKEN ekleyin.",
  );
}

async function withSafeBlobEnv<T>(auth: BlobAuthOptions, run: () => Promise<T>) {
  const savedToken = process.env.BLOB_READ_WRITE_TOKEN;
  const shouldHideToken =
    Boolean(auth.oidcToken) &&
    Boolean(savedToken) &&
    Boolean(auth.storeId) &&
    !tokenMatchesStore(savedToken!, auth.storeId!);

  if (shouldHideToken) {
    delete process.env.BLOB_READ_WRITE_TOKEN;
  }

  try {
    return await run();
  } finally {
    if (shouldHideToken && savedToken !== undefined) {
      process.env.BLOB_READ_WRITE_TOKEN = savedToken;
    }
  }
}

async function detectBlobAccess(auth: BlobAuthOptions): Promise<BlobAccess> {
  const configured = getConfiguredAccess();
  if (configured) {
    return configured;
  }

  if (resolvedAccess) {
    return resolvedAccess;
  }

  let newest: { access: BlobAccess; uploadedAt: number } | null = null;

  for (const access of ACCESS_MODES) {
    try {
      const meta = await head(BLOB_PATHNAME, { access, ...auth });
      const uploadedAt = meta.uploadedAt.getTime();

      if (!newest || uploadedAt > newest.uploadedAt) {
        newest = { access, uploadedAt };
      }
    } catch {
      // Blob bu erişim modunda yok veya erişilemiyor
    }
  }

  resolvedAccess = newest?.access ?? "private";
  return resolvedAccess;
}

async function blobGetWithAccess(auth: BlobAuthOptions, access: BlobAccess, pathname: string) {
  return get(pathname, { access, ...auth });
}

async function blobPutWithAccess(
  auth: BlobAuthOptions,
  access: BlobAccess,
  pathname: string,
  body: string,
) {
  await put(pathname, body, {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...auth,
  });
}

async function blobGet(pathname: string = BLOB_PATHNAME) {
  const auth = await resolveBlobAuthOptions();

  return withSafeBlobEnv(auth, async () => {
    const primaryAccess = await detectBlobAccess(auth);

    try {
      const result = await blobGetWithAccess(auth, primaryAccess, pathname);
      resolvedAccess = primaryAccess;
      return result;
    } catch (primaryError) {
      const fallbackAccess: BlobAccess = primaryAccess === "private" ? "public" : "private";

      try {
        const result = await blobGetWithAccess(auth, fallbackAccess, pathname);
        resolvedAccess = fallbackAccess;
        return result;
      } catch {
        throw primaryError;
      }
    }
  });
}

async function blobPut(body: string, pathname: string = BLOB_PATHNAME): Promise<BlobAccess> {
  const auth = await resolveBlobAuthOptions();

  return withSafeBlobEnv(auth, async () => {
    const primaryAccess = await detectBlobAccess(auth);

    try {
      await blobPutWithAccess(auth, primaryAccess, pathname, body);
      resolvedAccess = primaryAccess;
      return primaryAccess;
    } catch (primaryError) {
      const fallbackAccess: BlobAccess = primaryAccess === "private" ? "public" : "private";

      try {
        await blobPutWithAccess(auth, fallbackAccess, pathname, body);
        resolvedAccess = fallbackAccess;
        return fallbackAccess;
      } catch {
        throw primaryError;
      }
    }
  });
}

function isContactMessage(value: unknown): value is ContactMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as ContactMessage;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    typeof item.subject === "string" &&
    typeof item.message === "string" &&
    typeof item.createdAt === "string"
  );
}

export async function loadMessages(): Promise<ContactMessage[]> {
  try {
    const result = await blobGet(MESSAGES_PATHNAME);
    if (result?.stream) {
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(isContactMessage).slice(0, MAX_MESSAGES);
      }
    }
  } catch {
    // Ayrı mesaj dosyası yoksa site içeriğindeki eski mesajlara düş
  }

  try {
    const { content } = await loadSiteContent();
    return (content.messages ?? []).filter(isContactMessage).slice(0, MAX_MESSAGES);
  } catch {
    return [];
  }
}

export async function saveMessages(messages: ContactMessage[]): Promise<ContactMessage[]> {
  const normalized = messages.filter(isContactMessage).slice(0, MAX_MESSAGES);
  await blobPut(JSON.stringify(normalized, null, 2), MESSAGES_PATHNAME);
  return normalized;
}

export async function appendContactMessage(
  entry: Omit<ContactMessage, "id" | "read" | "createdAt"> & Partial<ContactMessage>,
): Promise<ContactMessage> {
  const messages = await loadMessages();
  const next: ContactMessage = {
    id: entry.id ?? crypto.randomUUID(),
    name: entry.name,
    email: entry.email,
    subject: entry.subject,
    message: entry.message,
    read: entry.read ?? false,
    createdAt: entry.createdAt ?? new Date().toISOString(),
  };

  await saveMessages([next, ...messages]);
  return next;
}

function readDefaultContent(): SiteContent {
  const filePath = join(process.cwd(), "data/site-content.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as SiteContent;
}

export async function loadSiteContent(): Promise<{
  content: SiteContent;
  source: "blob" | "default";
}> {
  try {
    const result = await blobGet();

    if (result?.stream) {
      const text = await new Response(result.stream).text();
      return {
        content: normalizeContent(JSON.parse(text) as SiteContent),
        source: "blob",
      };
    }
  } catch {
    // Blob yoksa veya okunamıyorsa varsayılana düş
  }

  return {
    content: normalizeContent(readDefaultContent()),
    source: "default",
  };
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  // Mesajlar ayrı blob dosyasında tutulur; site içeriği kaydı onları ezmesin
  const normalized = normalizeContent({ ...content, messages: [] });
  const body = JSON.stringify(normalized, null, 2);
  await blobPut(body);
  return normalized;
}
