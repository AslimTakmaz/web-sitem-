export interface ContentField {
  id: string;
  label: string;
  value: string;
}

export type SkillLevel = "learning" | "using" | "good";
export type SkillCategory = "frontend" | "backend" | "database" | "other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  features: string[];
  imageUrl?: string;
  published?: boolean;
  status?: "completed" | "in-progress";
  links: {
    github?: string;
    demo?: string;
  };
}

export interface ThemePalette {
  accent: string;
  accentHover: string;
  babyBlue: string;
  label: string;
}

export interface PersonalData {
  name: string;
  siteUrl: string;
  title: string;
  tagline: string;
  statusLine?: string;
  profileImage?: string;
  cvUrl?: string;
  social: {
    github: string;
    linkedin: string;
  };
  contact: {
    email: string;
  };
  generalExtras: ContentField[];
  about: {
    bio: string;
    interest: string;
    technologies: string[];
    focusAreas: string[];
    education: {
      title: string;
      period: string;
      description: string;
    };
    extras: ContentField[];
  };
}

export interface SiteContent {
  personal: PersonalData;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  seo: SeoSettings;
  theme: {
    dark: ThemePalette;
    light: ThemePalette;
  };
}
