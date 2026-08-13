import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent } from "../data/defaultContent";
import { normalizeContent } from "../data/normalizeContent";
import { applyTheme, getCachedTheme } from "../lib/themeStorage";
import type { SiteContent } from "../types/siteContent";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
  applySavedContent: (data: SiteContent) => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function getInitialContent(): SiteContent {
  const cachedTheme = getCachedTheme();
  if (!cachedTheme) return defaultContent;

  return normalizeContent({
    ...defaultContent,
    theme: cachedTheme,
  });
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
        const data = normalizeContent((await response.json()) as SiteContent);
        setContent(data);
        applyTheme(data.theme);
        setLoading(false);
        return;
      }
    } catch {
      // API yoksa statik dosyaya düş
    }

    try {
      const fallback = await fetch("/site-content.json");
      if (fallback.ok) {
        const data = normalizeContent((await fallback.json()) as SiteContent);
        setContent(data);
        applyTheme(data.theme);
      } else {
        setContent(defaultContent);
        applyTheme(defaultContent.theme);
      }
    } catch {
      setContent(defaultContent);
      applyTheme(defaultContent.theme);
    } finally {
      setLoading(false);
    }
  };

  const applySavedContent = (data: SiteContent) => {
    const normalized = normalizeContent(data);
    setContent(normalized);
    applyTheme(normalized.theme);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

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
