import { useSiteContent } from "../../context/SiteContentContext";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Footer.module.css";

export function Footer() {
  const { content } = useSiteContent();
  const { personal } = content;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.name}>{personal.name}</p>
        <p className={styles.copyright}>
          &copy; {year} {personal.name}. Tüm hakları saklıdır.
        </p>
        <div className={styles.links}>
          {personal.social.github.trim() && (
            <a
              href={personal.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <GitHubIcon />
              GitHub
            </a>
          )}
          {personal.social.linkedin.trim() && (
            <a
              href={personal.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <LinkedInIcon />
              LinkedIn
            </a>
          )}
          {personal.contact.email.trim() && (
            <a
              href={`mailto:${personal.contact.email}`}
              className={styles.link}
            >
              <EmailIcon />
              E-posta
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
