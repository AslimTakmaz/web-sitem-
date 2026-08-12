export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  features: string[];
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
  social: {
    github: string;
    linkedin: string;
  };
  contact: {
    email: string;
  };
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
  };
}

export interface SiteContent {
  personal: PersonalData;
  projects: Project[];
  theme: {
    dark: ThemePalette;
    light: ThemePalette;
  };
}
