import { personal } from "../../data/personal";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.section} aria-label="İletişim">
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.sectionLabel}>İletişim</p>
          <h2 className={styles.sectionTitle}>Benimle iletişime geçin</h2>
        </header>

        <div className={styles.grid}>
          <div className={styles.infoBlock}>
            <p className={styles.intro}>
              Bir proje, iş birliği veya soru için aşağıdaki kanallardan bana
              ulaşabilirsiniz.
            </p>

            <div className={styles.contactLinks}>
              <a
                href={`mailto:${personal.contact.email}`}
                className={styles.contactLink}
              >
                <EmailIcon />
                {personal.contact.email}
              </a>
              <a
                href={personal.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <GitHubIcon />
                GitHub
              </a>
              <a
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </div>
          </div>

          <div className={styles.formBlock}>
            <h3 className={styles.formTitle}>Mesaj Gönder</h3>
            <p className={styles.formNote}>
              Form altyapısı henüz yapılandırılmadı. Backend eklendiğinde
              aktif hale getirilecektir.
            </p>

            <form
              className={styles.form}
              aria-label="İletişim formu"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.fieldGroup}>
                <label htmlFor="contact-name" className={styles.label}>
                  İsim
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="Adınız Soyadınız"
                  disabled
                  aria-disabled="true"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="contact-email" className={styles.label}>
                  E-posta
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="ornek@email.com"
                  disabled
                  aria-disabled="true"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="contact-message" className={styles.label}>
                  Mesaj
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className={styles.textarea}
                  placeholder="Mesajınızı yazın..."
                  disabled
                  aria-disabled="true"
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled
                aria-disabled="true"
                title="Form henüz yapılandırılmadı"
              >
                Gönder (Yakında)
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
