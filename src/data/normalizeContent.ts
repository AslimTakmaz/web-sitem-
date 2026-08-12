import { defaultContent } from "./defaultContent";
import type { SiteContent } from "../types/siteContent";

export function normalizeContent(data: SiteContent): SiteContent {
  return {
    ...defaultContent,
    ...data,
    personal: {
      ...defaultContent.personal,
      ...data.personal,
      social: {
        ...defaultContent.personal.social,
        ...data.personal.social,
      },
      contact: {
        ...defaultContent.personal.contact,
        ...data.personal.contact,
      },
      generalExtras: data.personal.generalExtras ?? [],
      about: {
        ...defaultContent.personal.about,
        ...data.personal.about,
        education: {
          ...defaultContent.personal.about.education,
          ...data.personal.about?.education,
        },
        technologies:
          data.personal.about?.technologies ?? defaultContent.personal.about.technologies,
        focusAreas:
          data.personal.about?.focusAreas ?? defaultContent.personal.about.focusAreas,
        extras: data.personal.about?.extras ?? [],
      },
    },
    projects: data.projects ?? defaultContent.projects,
    theme: {
      dark: { ...defaultContent.theme.dark, ...data.theme?.dark },
      light: { ...defaultContent.theme.light, ...data.theme?.light },
    },
  };
}
