import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent } from "../data/defaultContent";
import { normalizeContent } from "../data/normalizeContent";
import type { SiteContent } from "../types/siteContent";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
  applySavedContent: (data: SiteContent) => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function applyTheme(theme: SiteContent["theme"]) {
  let styleEl = document.getElementById("dynamic-theme") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dynamic-theme";
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    [data-theme="dark"] {
      --color-accent: ${theme.dark.accent};
      --color-accent-hover: ${theme.dark.accentHover};
      --color-baby-blue: ${theme.dark.babyBlue};
      --color-label: ${theme.dark.label};
      --gradient-line-end: ${hexToRgba(theme.dark.babyBlue, 0.12)};
    }
    [data-theme="light"] {
      --color-accent: ${theme.light.accent};
      --color-accent-hover: ${theme.light.accentHover};
      --color-baby-blue: ${theme.light.babyBlue};
      --color-label: ${theme.light.label};
      --gradient-line-end: ${hexToRgba(theme.light.label, 0.1)};
    }
  `;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
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
