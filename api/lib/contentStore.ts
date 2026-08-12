import { readFileSync } from "node:fs";
import { join } from "node:path";
import { get, put } from "@vercel/blob";
import type { SiteContent } from "../../src/types/siteContent";
import { normalizeContent } from "./normalizeContent.js";

const BLOB_PATHNAME = "portfolio/site-content.json";

function readDefaultContent(): SiteContent {
  const filePath = join(process.cwd(), "data/site-content.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as SiteContent;
}

export async function loadSiteContent(): Promise<SiteContent> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const result = await get(BLOB_PATHNAME, {
        access: "private",
        token: process.env.BLOB_READ_WRITE_TOKEN,
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
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN tanımlı değil");
  }

  await put(BLOB_PATHNAME, JSON.stringify(content, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
