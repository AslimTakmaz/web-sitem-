import { readFileSync } from "node:fs";
import { join } from "node:path";
import { get, put } from "@vercel/blob";
import type { SiteContent } from "../../src/types/siteContent";
import { normalizeContent } from "./normalizeContent.js";

const BLOB_PATHNAME = "portfolio/site-content.json";

function hasOidcAuth() {
  return Boolean(process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID);
}

function hasBlobAuth() {
  return hasOidcAuth() || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Vercel'de OIDC varken explicit token geçmeyin — yanlış token OIDC'yi ezer. */
function blobAuthOptions() {
  if (hasOidcAuth()) {
    return {};
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN };
  }

  return {};
}

function readDefaultContent(): SiteContent {
  const filePath = join(process.cwd(), "data/site-content.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as SiteContent;
}

export async function loadSiteContent(): Promise<SiteContent> {
  if (hasBlobAuth()) {
    try {
      const result = await get(BLOB_PATHNAME, {
        access: "private",
        ...blobAuthOptions(),
      });

      if (result?.stream) {
        const text = await new Response(result.stream).text();
        return normalizeContent(JSON.parse(text) as SiteContent);
      }
    } catch {
      // Blob yoksa varsayılana düş
    }
  }

  return normalizeContent(readDefaultContent());
}

export async function saveSiteContent(content: SiteContent) {
  if (!hasBlobAuth()) {
    throw new Error(
      "Blob bağlantısı yok. Vercel'de Storage → Blob store'u projeye bağlayın veya BLOB_READ_WRITE_TOKEN ekleyin.",
    );
  }

  await put(BLOB_PATHNAME, JSON.stringify(content, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...blobAuthOptions(),
  });
}
