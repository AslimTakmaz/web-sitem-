import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Project, SiteContent } from "../../src/types/siteContent";

const LEGACY_TAGLINE =
  "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.";
const LEGACY_SEO_DESCRIPTION =
  "Aslım Takmaz — Software Development Intern. Modern web teknolojileri ile kullanıcı odaklı web uygulamaları geliştiriyorum.";

let cachedDefaults: SiteContent | null = null;

function getDefaults(): SiteContent {
  if (!cachedDefaults) {
    const filePath = join(process.cwd(), "data/site-content.json");
    cachedDefaults = JSON.parse(readFileSync(filePath, "utf8")) as SiteContent;
  }
  return cachedDefaults;
}

/** Varsayılan sırayı korur; Blob’daki düzenlemeleri id ile birleştirir. */
function mergeProjects(stored: Project[] | undefined, defaults: Project[]): Project[] {
  const list = stored ?? defaults;
  const byId = new Map(list.map((p) => [p.id, p]));
  const defaultIds = new Set(defaults.map((p) => p.id));
  const ordered = defaults.map((project) => byId.get(project.id) ?? project);
  const extras = list.filter((p) => !defaultIds.has(p.id));
  return [...ordered, ...extras].map((project) => ({
    ...project,
    published: project.published ?? true,
  }));
}

export function normalizeContent(data: SiteContent): SiteContent {
  const defaults = getDefaults();
  const tagline =
    !data.personal?.tagline || data.personal.tagline === LEGACY_TAGLINE
      ? defaults.personal.tagline
      : data.personal.tagline;
  const seoDescription =
    !data.seo?.description || data.seo.description === LEGACY_SEO_DESCRIPTION
      ? defaults.seo.description
      : data.seo.description;

  return {
    ...defaults,
    ...data,
    personal: {
      ...defaults.personal,
      ...data.personal,
      tagline,
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
      description: seoDescription,
    },
    messages: data.messages ?? defaults.messages,
    theme: {
      dark: { ...defaults.theme.dark, ...data.theme?.dark },
      light: { ...defaults.theme.light, ...data.theme?.light },
    },
  };
}
