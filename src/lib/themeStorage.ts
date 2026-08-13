import type { SiteContent } from "../types/siteContent";
import { defaultContent } from "../data/defaultContent";
import { normalizeContent } from "../data/normalizeContent";

export const THEME_STORAGE_KEY = "site-theme";
export const THEME_CSS_STORAGE_KEY = "site-theme-css";
export const CONTENT_CACHE_KEY = "site-content-cache";

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

export function buildThemeCss(theme: SiteContent["theme"]) {
  return `
    html[data-theme="dark"] {
      --color-accent: ${theme.dark.accent};
      --color-accent-hover: ${theme.dark.accentHover};
      --color-baby-blue: ${theme.dark.babyBlue};
      --color-label: ${theme.dark.label};
      --gradient-line-end: ${hexToRgba(theme.dark.babyBlue, 0.12)};
    }
    html[data-theme="light"] {
      --color-accent: ${theme.light.accent};
      --color-accent-hover: ${theme.light.accentHover};
      --color-baby-blue: ${theme.light.babyBlue};
      --color-label: ${theme.light.label};
      --gradient-line-end: ${hexToRgba(theme.light.label, 0.1)};
    }
  `;
}

export function getCachedTheme(): SiteContent["theme"] | null {
  const cachedContent = getCachedContent();
  return cachedContent?.theme ?? null;
}

export function getCachedContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return null;
    return normalizeContent(JSON.parse(raw) as SiteContent);
  } catch {
    return null;
  }
}

export function persistContentCache(content: SiteContent) {
  const normalized = normalizeContent(content);
  const css = buildThemeCss(normalized.theme);

  try {
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(normalized));
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(normalized.theme));
    localStorage.setItem(THEME_CSS_STORAGE_KEY, css);
  } catch {
    // localStorage dolu veya kapalı olabilir
  }

  return normalized;
}

export function persistTheme(theme: SiteContent["theme"]) {
  const css = buildThemeCss(theme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    localStorage.setItem(THEME_CSS_STORAGE_KEY, css);
  } catch {
    // localStorage dolu veya kapalı olabilir
  }

  return css;
}

export function applyTheme(theme: SiteContent["theme"]) {
  const css = persistTheme(theme);
  let styleEl = document.getElementById("dynamic-theme") as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dynamic-theme";
  }

  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

export function getBootstrapTheme() {
  return getCachedTheme() ?? defaultContent.theme;
}
