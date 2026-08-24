import { defaultContent } from "./defaultContent";
import type { Project, SiteContent } from "../types/siteContent";

const LEGACY_TAGLINE =
  "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.";
const LEGACY_SEO_DESCRIPTION =
  "Aslım Takmaz — Software Development Intern. Modern web teknolojileri ile kullanıcı odaklı web uygulamaları geliştiriyorum.";

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
  const tagline =
    !data.personal?.tagline || data.personal.tagline === LEGACY_TAGLINE
      ? defaultContent.personal.tagline
      : data.personal.tagline;
  const seoDescription =
    !data.seo?.description || data.seo.description === LEGACY_SEO_DESCRIPTION
      ? defaultContent.seo.description
      : data.seo.description;

  return {
    ...defaultContent,
    ...data,
    personal: {
      ...defaultContent.personal,
      ...data.personal,
      tagline,
      social: {
        ...defaultContent.personal.social,
        ...data.personal?.social,
      },
      contact: {
        ...defaultContent.personal.contact,
        ...data.personal?.contact,
      },
      about: {
        ...defaultContent.personal.about,
        ...data.personal?.about,
        education: {
          ...defaultContent.personal.about.education,
          ...data.personal?.about?.education,
        },
        technologies:
          data.personal?.about?.technologies ?? defaultContent.personal.about.technologies,
        focusAreas:
          data.personal?.about?.focusAreas ?? defaultContent.personal.about.focusAreas,
        extras: data.personal?.about?.extras ?? [],
      },
    },
    projects: mergeProjects(data.projects, defaultContent.projects),
    skills: data.skills ?? defaultContent.skills,
    experiences: data.experiences ?? defaultContent.experiences,
    seo: {
      ...defaultContent.seo,
      ...data.seo,
      description: seoDescription,
    },
    messages: data.messages ?? defaultContent.messages,
    theme: {
      dark: { ...defaultContent.theme.dark, ...data.theme?.dark },
      light: { ...defaultContent.theme.light, ...data.theme?.light },
    },
  };
}
