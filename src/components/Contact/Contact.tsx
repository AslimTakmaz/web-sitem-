import { useSiteContent } from "../../context/SiteContentContext";
import { EmailIcon, ExternalLinkIcon, GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Contact.module.css";

export function Contact() {
  const { content } = useSiteContent();
  const { personal } = content;
  const mailtoLink = `mailto:${personal.contact.email}?subject=${encodeURIComponent(
    "Portföy sitesinden iletişim"
  )}`;

  return (
    <section id="contact" className={styles.section} aria-label="İletişim">
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.sectionLabel}>İletişim</p>
          <h2 className={styles.sectionTitle}>Benimle iletişime geçin</h2>
        </header>

        <div className={styles.content}>
          <p className={styles.intro}>
            Bir proje, iş birliği veya soru için doğrudan e-posta gönderebilir
            veya LinkedIn üzerinden mesaj atabilirsiniz.
          </p>

          <div className={styles.contactLinks}>
            <a href={mailtoLink} className={styles.contactLink}>
              <EmailIcon />
              <span className={styles.linkText}>
                <span className={styles.linkLabel}>E-posta</span>
                <span className={styles.linkValue}>{personal.contact.email}</span>
              </span>
            </a>

            <a
              href={personal.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              <LinkedInIcon />
              <span className={styles.linkText}>
                <span className={styles.linkLabel}>LinkedIn</span>
                <span className={styles.linkValue}>Mesaj gönder</span>
              </span>
            </a>

            <a
              href={personal.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.contactLink} ${styles.contactLinkSecondary}`}
            >
              <GitHubIcon />
              <span className={styles.linkText}>
                <span className={styles.linkLabel}>GitHub</span>
                <span className={styles.linkValue}>Profilimi görüntüle</span>
              </span>
            </a>

            {personal.generalExtras.map((extra) => {
              const isLink = /^https?:\/\//i.test(extra.value.trim());

              if (isLink) {
                return (
                  <a
                    key={extra.id}
                    href={extra.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    <ExternalLinkIcon />
                    <span className={styles.linkText}>
                      <span className={styles.linkLabel}>{extra.label}</span>
                      <span className={styles.linkValue}>Bağlantıyı aç</span>
                    </span>
                  </a>
                );
              }

              return (
                <div key={extra.id} className={styles.contactLink}>
                  <ExternalLinkIcon />
                  <span className={styles.linkText}>
                    <span className={styles.linkLabel}>{extra.label}</span>
                    <span className={styles.linkValue}>{extra.value}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
