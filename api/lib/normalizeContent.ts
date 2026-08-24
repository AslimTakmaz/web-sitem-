import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Project, SiteContent } from "../../src/types/siteContent";

let cachedDefaults: SiteContent | null = null;

function getDefaults(): SiteContent {
  if (!cachedDefaults) {
    const filePath = join(process.cwd(), "data/site-content.json");
    cachedDefaults = JSON.parse(readFileSync(filePath, "utf8")) as SiteContent;
  }
  return cachedDefaults;
}

/** Blob’da olmayan varsayılan projeleri öne ekler (silinen özel projeleri ezmez). */
function mergeProjects(stored: Project[] | undefined, defaults: Project[]): Project[] {
  const list = stored ?? defaults;
  const ids = new Set(list.map((p) => p.id));
  const missing = defaults.filter((p) => !ids.has(p.id));
  return [...missing, ...list].map((project) => ({
    ...project,
    published: project.published ?? true,
  }));
}

export function normalizeContent(data: SiteContent): SiteContent {
  const defaults = getDefaults();

  return {
    ...defaults,
    ...data,
    personal: {
      ...defaults.personal,
      ...data.personal,
      social: {
        ...defaults.personal.social,
        ...data.personal?.social,
      },
      contact: {
        ...defaults.personal.contact,
        ...data.personal?.contact,
      },
      generalExtras: data.personal?.generalExtras ?? [],
      about: {
        ...defaults.personal.about,
        ...data.personal?.about,
        education: {
          ...defaults.personal.about.education,
          ...data.personal?.about?.education,
        },
        technologies:
          data.personal?.about?.technologies ?? defaults.personal.about.technologies,
        focusAreas:
          data.personal?.about?.focusAreas ?? defaults.personal.about.focusAreas,
        extras: data.personal?.about?.extras ?? [],
      },
    },
    projects: mergeProjects(data.projects, defaults.projects),
    skills: data.skills ?? defaults.skills,
    experiences: data.experiences ?? defaults.experiences,
    seo: {
      ...defaults.seo,
      ...data.seo,
    },
    messages: data.messages ?? defaults.messages,
    theme: {
      dark: { ...defaults.theme.dark, ...data.theme?.dark },
      light: { ...defaults.theme.light, ...data.theme?.light },
    },
  };
}
