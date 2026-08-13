import type { SiteContent } from "../types/siteContent";
import { defaultContent } from "../data/defaultContent";
import { normalizeContent } from "../data/normalizeContent";

export const THEME_STORAGE_KEY = "site-theme";
export const THEME_CSS_STORAGE_KEY = "site-theme-css";
export const CONTENT_CACHE_KEY = "site-content-cache";

const HEX_6 = /^#[0-9a-fA-F]{6}$/;
const HEX_3 = /^#[0-9a-fA-F]{3}$/;

export function normalizeHexColor(value: string, fallback: string) {
  const trimmed = value.trim();

  if (HEX_6.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  if (HEX_3.test(trimmed)) {
    const h = trimmed.slice(1);
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }

  return fallback;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = normalizeHexColor(hex, "#000000").replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildThemeCss(theme: SiteContent["theme"]) {
  return `
    html[data-theme="dark"] {
      --color-accent: ${normalizeHexColor(theme.dark.accent, defaultContent.theme.dark.accent)};
      --color-accent-hover: ${normalizeHexColor(theme.dark.accentHover, defaultContent.theme.dark.accentHover)};
      --color-baby-blue: ${normalizeHexColor(theme.dark.babyBlue, defaultContent.theme.dark.babyBlue)};
      --color-label: ${normalizeHexColor(theme.dark.label, defaultContent.theme.dark.label)};
      --gradient-line-end: ${hexToRgba(theme.dark.babyBlue, 0.12)};
    }
    html[data-theme="light"] {
      --color-accent: ${normalizeHexColor(theme.light.accent, defaultContent.theme.light.accent)};
      --color-accent-hover: ${normalizeHexColor(theme.light.accentHover, defaultContent.theme.light.accentHover)};
      --color-baby-blue: ${normalizeHexColor(theme.light.babyBlue, defaultContent.theme.light.babyBlue)};
      --color-label: ${normalizeHexColor(theme.light.label, defaultContent.theme.light.label)};
      --gradient-line-end: ${hexToRgba(theme.light.label, 0.1)};
    }
  `;
}

function mountThemeCss(css: string) {
  let styleEl = document.getElementById("dynamic-theme") as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dynamic-theme";
  }

  styleEl.textContent = css;
  document.head.appendChild(styleEl);
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

/** Kayıt/yükleme sonrası — localStorage + DOM */
export function applyTheme(theme: SiteContent["theme"]) {
  persistTheme(theme);
  mountThemeCss(buildThemeCss(theme));
}

/** Admin önizlemesi — sadece DOM, site cache'ine yazmaz */
export function applyThemePreview(theme: SiteContent["theme"]) {
  mountThemeCss(buildThemeCss(theme));
}

export function getBootstrapTheme() {
  return getCachedTheme() ?? defaultContent.theme;
}
