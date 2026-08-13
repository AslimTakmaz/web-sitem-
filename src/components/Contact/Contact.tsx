import { useState, type FormEvent } from "react";
import { useSiteContent } from "../../context/SiteContentContext";
import { EmailIcon, LocationIcon, PhoneIcon, SendIcon } from "../icons/SocialIcons";
import styles from "./Contact.module.css";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function Contact() {
  const { content } = useSiteContent();
  const { personal } = content;
  const { contact } = personal;
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const intro =
    contact.intro ??
    "Yeni projelere ve iş birliği fırsatlarına her zaman açığım. Aklınızda bir proje mi var? Konuşalım!";

  const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(
    "Portföy sitesinden iletişim",
  )}`;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let result: { error?: string } = {};
      try {
        result = (await response.json()) as { error?: string };
      } catch {
        setStatus("error");
        setErrorMessage("Sunucu yanıtı okunamadı.");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result.error ?? "Mesaj gönderilemedi.");
        return;
      }

      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  };

  return (
    <section id="contact" className={styles.section} aria-label="İletişim">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <p className={styles.sectionLabel}>İletişim</p>
            <h2 className={styles.sectionTitle}>Birlikte Çalışalım</h2>
            <p className={styles.intro}>{intro}</p>

            <div className={styles.infoList}>
              <a href={mailtoLink} className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <EmailIcon />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>E-posta</span>
                  <span className={styles.infoValue}>{contact.email}</span>
                </span>
              </a>

              {contact.phone?.trim() && (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={styles.infoItem}>
                  <span className={styles.infoIcon}>
                    <PhoneIcon />
                  </span>
                  <span className={styles.infoText}>
                    <span className={styles.infoLabel}>Telefon</span>
                    <span className={styles.infoValue}>{contact.phone}</span>
                  </span>
                </a>
              )}

              {contact.location?.trim() && (
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>
                    <LocationIcon />
                  </span>
                  <span className={styles.infoText}>
                    <span className={styles.infoLabel}>Konum</span>
                    <span className={styles.infoValue}>{contact.location}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formCard}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label className={styles.field}>
                <span className={styles.srOnly}>Adınız</span>
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  placeholder="Adınız"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  autoComplete="name"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.srOnly}>E-posta adresiniz</span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="E-posta adresiniz"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.srOnly}>Konu</span>
                <input
                  className={styles.input}
                  type="text"
                  name="subject"
                  placeholder="Konu"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.srOnly}>Mesajınız</span>
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Mesajınız"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  rows={5}
                />
              </label>

              {status === "success" && (
                <p className={styles.success} role="status">
                  Mesajınız gönderildi. En kısa sürede dönüş yapacağım.
                </p>
              )}

              {status === "error" && errorMessage && (
                <p className={styles.error} role="alert">
                  {errorMessage}
                </p>
              )}

              <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                {status === "loading" ? "Gönderiliyor..." : "Mesaj Gönder"}
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
