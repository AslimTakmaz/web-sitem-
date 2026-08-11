import { useEffect } from "react";
import { personal } from "../../data/personal";

export function Seo() {
  useEffect(() => {
    const { siteUrl, name, title, tagline, contact, social } = personal;
    const pageTitle = `${name} | ${title} | Portföy`;

    document.title = pageTitle;

    const setMeta = (key: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta(
      "description",
      `${name} — ${title}. ${tagline} aslimtakmazweb kişisel portföy sitesi.`,
    );
    setMeta(
      "keywords",
      "Aslım Takmaz, aslim takmaz, aslimtakmazweb, yazılım geliştirici, portföy, web developer",
    );
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", tagline, true);
    setMeta("og:url", siteUrl, true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", tagline);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", siteUrl);

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          name,
          jobTitle: title,
          url: siteUrl,
          email: contact.email,
          sameAs: [social.github, social.linkedin],
          description: tagline,
        },
        {
          "@type": "WebSite",
          name: "aslimtakmazweb",
          alternateName: name,
          url: siteUrl,
          description: `${name} kişisel portföy web sitesi`,
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
  }, []);

  return null;
}
