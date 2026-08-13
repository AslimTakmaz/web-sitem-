import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent } from "../data/defaultContent";
import { normalizeContent } from "../data/normalizeContent";
import {
  applyTheme,
  getCachedContent,
  persistContentCache,
} from "../lib/themeStorage";
import type { SiteContent } from "../types/siteContent";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
  applySavedContent: (data: SiteContent) => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function getInitialContent(): SiteContent {
  return getCachedContent() ?? defaultContent;
}

function syncContent(data: SiteContent) {
  const normalized = normalizeContent(data);
  persistContentCache(normalized);
  applyTheme(normalized.theme);
  return normalized;
}

export { applyTheme };

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(getInitialContent);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await fetch(`/api/content?_=${Date.now()}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = syncContent((await response.json()) as SiteContent);
        setContent(data);
        setLoading(false);
        return;
      }
    } catch {
      // API yoksa statik dosyaya düş
    }

    try {
      const fallback = await fetch("/site-content.json");
      if (fallback.ok) {
        const data = syncContent((await fallback.json()) as SiteContent);
        setContent(data);
      } else {
        const data = syncContent(defaultContent);
        setContent(data);
      }
    } catch {
      const data = syncContent(defaultContent);
      setContent(data);
    } finally {
      setLoading(false);
    }
  };

  const applySavedContent = (data: SiteContent) => {
    const normalized = syncContent(data);
    setContent(normalized);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (loading) return;
    applyTheme(content.theme);
  }, [content.theme, loading]);

  return (
    <SiteContentContext.Provider value={{ content, loading, refresh, applySavedContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent SiteContentProvider içinde kullanılmalıdır");
  }
  return context;
}
