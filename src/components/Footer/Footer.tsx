import { personal } from "../../data/personal";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.name}>{personal.name}</p>
        <p className={styles.copyright}>
          &copy; {year} {personal.name}. Tüm hakları saklıdır.
        </p>
        <div className={styles.links}>
          <a
            href={personal.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href={personal.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href={`mailto:${personal.contact.email}`}
            className={styles.link}
          >
            <EmailIcon />
            E-posta
          </a>
        </div>
      </div>
    </footer>
  );
}
