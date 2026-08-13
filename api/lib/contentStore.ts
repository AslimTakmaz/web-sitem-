import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getVercelOidcToken } from "@vercel/oidc";
import { get, put } from "@vercel/blob";
import type { SiteContent } from "../../src/types/siteContent";
import { normalizeContent } from "./normalizeContent.js";

const BLOB_PATHNAME = "portfolio/site-content.json";

let preferredBlobAccess: "private" | "public" | null = null;

function getAccessOrder(): ("private" | "public")[] {
  if (preferredBlobAccess) {
    const fallback = preferredBlobAccess === "private" ? "public" : "private";
    return [preferredBlobAccess, fallback];
  }

  return ["private", "public"];
}

type BlobAuthOptions = {
  token?: string;
  oidcToken?: string;
  storeId?: string;
};

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

/** Yanlış env token'ının SDK tarafından fallback olarak kullanılmasını engeller. */
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

async function blobGet() {
  const auth = await resolveBlobAuthOptions();

  return withSafeBlobEnv(auth, async () => {
    for (const access of getAccessOrder()) {
      try {
        const result = await get(BLOB_PATHNAME, { access, ...auth });
        preferredBlobAccess = access;
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const isLast = access === "public";
        const isAccessDenied = message.includes("Access denied");

        if (isLast || !isAccessDenied) {
          throw error;
        }
      }
    }

    return undefined;
  });
}

async function blobPut(body: string) {
  const auth = await resolveBlobAuthOptions();

  await withSafeBlobEnv(auth, async () => {
    let lastError: unknown;

    for (const access of getAccessOrder()) {
      try {
        await put(BLOB_PATHNAME, body, {
          access,
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "application/json",
          ...auth,
        });
        preferredBlobAccess = access;
        return;
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : "";
        if (!message.includes("Access denied") || access === "public") {
          throw error;
        }
      }
    }

    throw lastError;
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

  try {
    const result = await blobGet();
    if (result?.stream) {
      const text = await new Response(result.stream).text();
      return normalizeContent(JSON.parse(text) as SiteContent);
    }
  } catch {
    // Doğrulama okuması başarısız olsa da kaydedilen normalize içeriği döndür
  }

  return normalized;
}
