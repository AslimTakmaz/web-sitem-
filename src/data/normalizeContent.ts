import { defaultContent } from "./defaultContent";
import type { Project, SiteContent } from "../types/siteContent";

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
  return {
    ...defaultContent,
    ...data,
    personal: {
      ...defaultContent.personal,
      ...data.personal,
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
    },
    messages: data.messages ?? defaultContent.messages,
    theme: {
      dark: { ...defaultContent.theme.dark, ...data.theme?.dark },
      light: { ...defaultContent.theme.light, ...data.theme?.light },
    },
  };
}
