import { useSiteContent } from "../../context/SiteContentContext";
import { ExternalLinkIcon, GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Hero.module.css";

export function Hero() {
  const { content } = useSiteContent();
  const { personal } = content;
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className={styles.hero} aria-label="Ana sayfa">
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.greeting}>Merhaba, ben</p>
          <h1 className={styles.name}>{personal.name}</h1>
          <p className={styles.title}>{personal.title}</p>
          <p className={styles.tagline}>{personal.tagline}</p>

          <ul className={styles.techList} aria-label="Kullandığım teknolojiler">
            {personal.about.technologies.map((tech) => (
              <li key={tech} className={styles.techTag}>
                {tech}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => scrollTo("projects")}
            >
              Projelerimi Gör
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => scrollTo("contact")}
            >
              İletişime Geç
            </button>
          </div>

          <div className={styles.social}>
            <a
              href={personal.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub profili"
            >
              <GitHubIcon />
            </a>
            <a
              href={personal.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn profili"
            >
              <LinkedInIcon />
            </a>
            {personal.generalExtras
              .filter((extra) => /^https?:\/\//i.test(extra.value.trim()))
              .map((extra) => (
                <a
                  key={extra.id}
                  href={extra.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={extra.label}
                >
                  <ExternalLinkIcon />
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
