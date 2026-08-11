import { useState, type FormEvent } from "react";
import { personal } from "../../data/personal";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "../icons/SocialIcons";
import styles from "./Contact.module.css";

type FormStatus = "idle" | "loading" | "success" | "error" | "activation";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("_subject", "Portföy sitesinden yeni mesaj");
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(personal.contact.email)}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        }
      );

      const result = (await response.json()) as {
        success?: boolean | string;
        message?: string;
      };

      const isSuccess =
        result.success === true || result.success === "true";

      if (isSuccess) {
        setStatus("success");
        form.reset();
        return;
      }

      if (result.message?.toLowerCase().includes("activation")) {
        setStatus("activation");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

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
              Formu doldurun, mesajınız doğrudan e-posta adresime iletilir.
            </p>

            {status === "success" && (
              <p className={styles.formSuccess} role="status">
                Mesajınız gönderildi. En kısa sürede dönüş yapacağım.
              </p>
            )}

            {status === "activation" && (
              <p className={styles.formSuccess} role="status">
                FormSubmit onay maili gönderildi. Gmail&apos;indeki
                &quot;Activate Form&quot; linkine tıkla; sonrasında mesajlar
                gelmeye başlar.
              </p>
            )}

            {status === "error" && (
              <p className={styles.formError} role="alert">
                Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya
                e-posta ile ulaşın.
              </p>
            )}

            <form
              className={styles.form}
              aria-label="İletişim formu"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="_honey"
                className={styles.honeypot}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

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
                  required
                  autoComplete="name"
                  disabled={status === "loading"}
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
                  required
                  autoComplete="email"
                  disabled={status === "loading"}
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
                  required
                  minLength={10}
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
