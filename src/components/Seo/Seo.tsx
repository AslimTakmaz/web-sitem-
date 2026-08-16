import { useEffect } from "react";
import { useSiteContent } from "../../context/SiteContentContext";

export function Seo() {
  const { content } = useSiteContent();

  useEffect(() => {
    const { siteUrl, name, title, tagline, contact, social } = content.personal;
    const seo = content.seo;
    const pageTitle = seo.title?.trim() || `${name} | ${title} | Portföy`;
    const description =
      seo.description?.trim() ||
      `${name} — ${title}. ${tagline}`;
    const keywords =
      seo.keywords?.trim() ||
      `${name}, yazılım geliştirici, portföy, web developer, React, TypeScript`;

    document.title = pageTitle;

    const setMeta = (key: string, value: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", siteUrl, true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", siteUrl);

    const sameAs = [social.github, social.linkedin, ...content.personal.generalExtras.map((e) => e.value)]
      .map((url) => url.trim())
      .filter((url) => /^https?:\/\//i.test(url));

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          name,
          jobTitle: title,
          url: siteUrl,
          email: contact.email,
          sameAs,
          description: tagline,
        },
        {
          "@type": "WebSite",
          name,
          url: siteUrl,
          description,
        },
      ],
    };

    let script = document.getElementById("schema-json") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "schema-json";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [content.personal, content.seo]);

  return null;
}
