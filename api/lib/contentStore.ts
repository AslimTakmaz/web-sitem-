import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getVercelOidcToken } from "@vercel/oidc";
import { get, head, put } from "@vercel/blob";
import type { SiteContent } from "../../src/types/siteContent";
import { normalizeContent } from "./normalizeContent.js";

const BLOB_PATHNAME = "portfolio/site-content.json";
const ACCESS_MODES = ["private", "public"] as const;

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

async function blobGetWithAccess(auth: BlobAuthOptions, access: BlobAccess) {
  return get(BLOB_PATHNAME, { access, ...auth });
}

async function blobPutWithAccess(auth: BlobAuthOptions, access: BlobAccess, body: string) {
  await put(BLOB_PATHNAME, body, {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...auth,
  });
}

async function blobGet() {
  const auth = await resolveBlobAuthOptions();

  return withSafeBlobEnv(auth, async () => {
    const primaryAccess = await detectBlobAccess(auth);

    try {
      const result = await blobGetWithAccess(auth, primaryAccess);
      resolvedAccess = primaryAccess;
      return result;
    } catch (primaryError) {
      const fallbackAccess: BlobAccess = primaryAccess === "private" ? "public" : "private";

      try {
        const result = await blobGetWithAccess(auth, fallbackAccess);
        resolvedAccess = fallbackAccess;
        return result;
      } catch {
        throw primaryError;
      }
    }
  });
}

async function blobPut(body: string): Promise<BlobAccess> {
  const auth = await resolveBlobAuthOptions();

  return withSafeBlobEnv(auth, async () => {
    const primaryAccess = await detectBlobAccess(auth);

    try {
      await blobPutWithAccess(auth, primaryAccess, body);
      resolvedAccess = primaryAccess;
      return primaryAccess;
    } catch (primaryError) {
      const fallbackAccess: BlobAccess = primaryAccess === "private" ? "public" : "private";

      try {
        await blobPutWithAccess(auth, fallbackAccess, body);
        resolvedAccess = fallbackAccess;
        return fallbackAccess;
      } catch {
        throw primaryError;
      }
    }
  });
}

function readDefaultContent(): SiteContent {
  const filePath = join(process.cwd(), "data/site-content.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as SiteContent;
}

export async function loadSiteContent(): Promise<SiteContent> {
  try {
    const result = await blobGet();

    if (result?.stream) {
      const text = await new Response(result.stream).text();
      return normalizeContent(JSON.parse(text) as SiteContent);
    }
  } catch {
    // Blob yoksa veya okunamıyorsa varsayılana düş
  }

  return normalizeContent(readDefaultContent());
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const normalized = normalizeContent(content);
  const body = JSON.stringify(normalized, null, 2);
  await blobPut(body);
  return normalized;
}
