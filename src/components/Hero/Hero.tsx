import { personal } from "../../data/personal";
import { GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Hero.module.css";

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className={styles.hero} aria-label="Ana sayfa">
      <div className={styles.container}>
        <div className={styles.layout}>
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
            </div>
          </div>

          <aside className={styles.visual} aria-hidden="true">
            <div className={styles.visualCard}>
              <div className={styles.visualGlow} />
              <div className={styles.mark}>
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text
                    x="7"
                    y="28"
                    className={styles.letterA}
                    fontFamily="Inter, system-ui, sans-serif"
                    fontSize="22"
                    fontWeight="300"
                  >
                    A
                  </text>
                  <text
                    x="19"
                    y="28"
                    className={styles.letterT}
                    fontFamily="Inter, system-ui, sans-serif"
                    fontSize="24"
                    fontWeight="700"
                  >
                    T
                  </text>
                </svg>
              </div>
              <p className={styles.visualSubtitle}>{personal.logoSubtitle}</p>
              <span className={styles.visualLine} />
              <p className={styles.visualMeta}>{personal.about.education.title}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
