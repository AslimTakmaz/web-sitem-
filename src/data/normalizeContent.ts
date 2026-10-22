import { defaultContent } from "./defaultContent";
import type { Project, SiteContent } from "../types/siteContent";

const LEGACY_TAGLINE =
  "Modern web teknolojileri kullanarak kullanıcı odaklı web uygulamaları geliştiriyorum.";
const LEGACY_SEO_DESCRIPTION =
  "Aslım Takmaz — Software Development Intern. Modern web teknolojileri ile kullanıcı odaklı web uygulamaları geliştiriyorum.";
const LEGACY_INTEREST =
  "Yazılıma olan ilgimi projeler geliştirerek ilerletiyorum. Kodlama bilgim başlangıç seviyesinde olsa da, yapay zekâ destekli araçları kullanarak Stajyer Takip Paneli geliştirdim ve şu anda kendi portföy web sitem üzerinde çalışıyorum.";

/** Varsayılan sırayı korur; Blob’daki düzenlemeleri id ile birleştirir. */
function mergeProjects(stored: Project[] | undefined, defaults: Project[]): Project[] {
  const list = stored ?? defaults;
  const byId = new Map(list.map((p) => [p.id, p]));
  const defaultIds = new Set(defaults.map((p) => p.id));
  const ordered = defaults.map((project) => {
    const storedProject = byId.get(project.id);
    if (!storedProject) return project;
    return {
      ...project,
      ...storedProject,
      // Varsayılandaki görsel kararı geçerli (kaldırılan ikon Blob’da kalmasın)
      imageUrl: project.imageUrl,
    };
  });
  const extras = list.filter((p) => !defaultIds.has(p.id));
  return [...ordered, ...extras].map((project) => ({
    ...project,
    published: project.published ?? true,
  }));
}

/** Blob’da olmayan varsayılan gelişim alanlarını sona ekler. */
function mergeFocusAreas(stored: string[] | undefined, defaults: string[]): string[] {
  const list = stored ?? defaults;
  const seen = new Set(list);
  const missing = defaults.filter((item) => !seen.has(item));
  return [...list, ...missing];
}

export function normalizeContent(data: SiteContent): SiteContent {
  const tagline =
    !data.personal?.tagline || data.personal.tagline === LEGACY_TAGLINE
      ? defaultContent.personal.tagline
      : data.personal.tagline;
  const interest =
    !data.personal?.about?.interest || data.personal.about.interest === LEGACY_INTEREST
      ? defaultContent.personal.about.interest
      : data.personal.about.interest;
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
        interest,
        education: {
          ...defaultContent.personal.about.education,
          ...data.personal?.about?.education,
        },
        technologies: mergeFocusAreas(
          data.personal?.about?.technologies,
          defaultContent.personal.about.technologies,
        ),
        focusAreas: mergeFocusAreas(
          data.personal?.about?.focusAreas,
          defaultContent.personal.about.focusAreas,
        ),
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
