import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/Logo/Logo";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { applyTheme, useSiteContent } from "../../context/SiteContentContext";
import { defaultContent } from "../../data/defaultContent";
import { normalizeContent } from "../../data/normalizeContent";
import type { Project, SiteContent, ThemePalette, ContentField } from "../../types/siteContent";
import styles from "./Admin.module.css";

const TOKEN_KEY = "portfolio-admin-token";

type Tab = "general" | "about" | "projects" | "colors";

const TABS: {
  id: Tab;
  label: string;
  description: string;
  icon: "general" | "about" | "projects" | "colors";
}[] = [
  { id: "general", label: "Genel", description: "İsim, iletişim ve sosyal medya", icon: "general" },
  { id: "about", label: "Hakkımda", description: "Biyografi, eğitim ve yetenekler", icon: "about" },
  { id: "projects", label: "Projeler", description: "Proje listesi ve detayları", icon: "projects" },
  { id: "colors", label: "Renkler", description: "Açık ve koyu tema renkleri", icon: "colors" },
];

function TabIcon({ name }: { name: (typeof TABS)[number]["icon"] }) {
  switch (name) {
    case "general":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
          <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" strokeLinecap="round" />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M7 4h10v16H7z" strokeLinejoin="round" />
          <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
        </svg>
      );
    case "projects":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M4 7h7v7H4zM13 7h7v4h-7zM13 13h7v7h-7zM4 16h7v4H4z" strokeLinejoin="round" />
        </svg>
      );
    case "colors":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M12 3c-4.4 0-8 2.7-8 6.5 0 2.1 1.4 4 3.5 5.1-.3.9-.8 2.1-1.5 2.9 1.8-.2 3.5-.9 4.8-2 1 .3 2 .5 3.2.5 4.4 0 8-2.7 8-6.5S16.4 3 12 3z" strokeLinejoin="round" />
          <circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12h10l1-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteButton({ onClick, label = "Sil" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className={styles.iconBtn} onClick={onClick} aria-label={label}>
      <TrashIcon />
    </button>
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [onClose, message]);

  return (
    <div className={`${styles.toast} ${type === "success" ? styles.toastSuccess : styles.toastError}`} role="status">
      {message}
    </div>
  );
}

function FieldBox({
  label,
  fullWidth = false,
  onDelete,
  children,
}: {
  label: string;
  fullWidth?: boolean;
  onDelete: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.fieldBox} ${fullWidth ? styles.fullWidth : ""}`}>
      <div className={styles.fieldBoxHeader}>
        <span className={styles.fieldBoxLabel}>{label}</span>
        <button type="button" className={styles.iconBtn} onClick={onDelete} aria-label={`${label} alanını sil`}>
          <TrashIcon />
        </button>
      </div>
      <div className={styles.fieldBoxBody}>{children}</div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.colorField}>
      <span>{label}</span>
      <div className={styles.colorInputRow}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
        />
      </div>
    </label>
  );
}

function ExtraFieldsEditor({
  title,
  hint,
  fields,
  multiline = false,
  onChange,
}: {
  title: string;
  hint: string;
  fields: ContentField[];
  multiline?: boolean;
  onChange: (fields: ContentField[]) => void;
}) {
  const addField = () => {
    onChange([
      ...fields,
      { id: `field-${Date.now()}`, label: "Yeni Alan", value: "" },
    ]);
  };

  const updateField = (id: string, patch: Partial<ContentField>) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  };

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  return (
    <div className={styles.extrasSection}>
      <div className={styles.extrasHeader}>
        <div>
          <h3 className={styles.extrasTitle}>{title}</h3>
          <p className={styles.extrasHint}>{hint}</p>
        </div>
        <button type="button" className={styles.secondaryBtn} onClick={addField}>
          + Ekle
        </button>
      </div>

      {fields.length === 0 && (
        <p className={styles.extrasEmpty}>Henüz ek alan yok. Ekle butonuyla yeni alan oluşturun.</p>
      )}

      {fields.map((field) => (
        <div key={field.id} className={styles.extraCard}>
          <div className={styles.extraCardHeader}>
            <span className={styles.extraCardLabel}>Özel Alan</span>
            <button type="button" className={styles.iconBtn} onClick={() => removeField(field.id)} aria-label="Özel alanı sil">
              <TrashIcon />
            </button>
          </div>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Başlık</span>
              <input
                className={styles.input}
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                placeholder={multiline ? "Bölüm başlığı" : "Instagram, YouTube..."}
              />
            </label>
            <label className={`${styles.field} ${multiline ? styles.fullWidth : ""}`}>
              <span>{multiline ? "İçerik" : "Değer / Link"}</span>
              {multiline ? (
                <textarea
                  className={styles.textarea}
                  value={field.value}
                  onChange={(e) => updateField(field.id, { value: e.target.value })}
                  placeholder="Bu bölümde görünecek metin"
                />
              ) : (
                <input
                  className={styles.input}
                  value={field.value}
                  onChange={(e) => updateField(field.id, { value: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              )}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeEditor({
  title,
  palette,
  onChange,
}: {
  title: string;
  palette: ThemePalette;
  onChange: (palette: ThemePalette) => void;
}) {
  const update = (key: keyof ThemePalette, value: string) => {
    onChange({ ...palette, [key]: value });
  };

  return (
    <div className={styles.themeBlock}>
      <h3 className={styles.themeTitle}>{title}</h3>
      <ColorField label="Ana renk" value={palette.accent} onChange={(v) => update("accent", v)} />
      <ColorField
        label="Hover rengi"
        value={palette.accentHover}
        onChange={(v) => update("accentHover", v)}
      />
      <ColorField
        label="Vurgu rengi"
        value={palette.babyBlue}
        onChange={(v) => update("babyBlue", v)}
      />
      <ColorField label="Etiket rengi" value={palette.label} onChange={(v) => update("label", v)} />
    </div>
  );
}

export function AdminPage() {
  const { applySavedContent } = useSiteContent();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [tab, setTab] = useState<Tab>("general");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!token) return;
    applyTheme(content.theme);
  }, [token, content.theme]);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/admin/content?_=${Date.now()}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          throw new Error("Yetkisiz");
        }
        if (!res.ok) {
          throw new Error("İçerik yüklenemedi");
        }
        return res.json() as Promise<SiteContent>;
      })
      .then((data) => setContent(normalizeContent(data)))
      .catch((error) => {
        if (error instanceof Error && error.message === "Yetkisiz") return;
        showToast("İçerik yüklenemedi. Sayfayı yenileyip tekrar deneyin.", "error");
      });
  }, [token]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.error ?? "Giriş başarısız");
        return;
      }

      sessionStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setPassword("");
    } catch {
      setLoginError("Sunucuya bağlanılamadı");
    }
  };

  const resetTheme = () => {
    const theme = {
      dark: { ...defaultContent.theme.dark },
      light: { ...defaultContent.theme.light },
    };

    setContent((prev) => ({
      ...prev,
      theme,
    }));
    applyTheme(theme);
    showToast("Renkler varsayılana sıfırlandı.", "success");
  };

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    setToast(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      const result = (await response.json()) as SiteContent | { error?: string };

      if (!response.ok) {
        showToast("error" in result ? result.error ?? "Kayıt başarısız" : "Kayıt başarısız", "error");
        return;
      }

      const saved = normalizeContent(result as SiteContent);
      setContent(saved);
      applySavedContent(saved);
      applyTheme(saved.theme);
      showToast("Değişiklikler kaydedildi.", "success");
    } catch {
      showToast("Kayıt sırasında hata oluştu.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateProject = (index: number, project: Project) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) => (i === index ? project : item)),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: `proje-${Date.now()}`,
      name: "Yeni Proje",
      description: "Proje açıklaması",
      technologies: ["React"],
      features: ["Özellik ekleyin"],
      links: {},
    };

    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const removeProject = (index: number) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  if (!token) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <p className={styles.loginBadge}>Yönetim</p>
          <h1 className={styles.title}>Admin Girişi</h1>
          <p className={styles.subtitle}>Site içeriğini düzenlemek için giriş yapın.</p>
          <form onSubmit={handleLogin} className={styles.form}>
            <label className={styles.field}>
              <span>Şifre</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </label>
            {loginError && <p className={styles.error}>{loginError}</p>}
            <button type="submit" className={styles.primaryBtn}>
              Giriş Yap
            </button>
          </form>
          <Link to="/" className={styles.backLink}>
            ← Siteye dön
          </Link>
        </div>
      </div>
    );
  }

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Logo />
          <div>
            <p className={styles.sidebarTitle}>Admin Panel</p>
            <p className={styles.sidebarSubtitle}>Web Sitem</p>
          </div>
        </div>

        <nav className={styles.sidebarNav} aria-label="Admin menüsü">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={`${styles.sidebarTab} ${tab === id ? styles.sidebarTabActive : ""}`}
              onClick={() => setTab(id)}
            >
              <span className={styles.sidebarTabIcon}>
                <TabIcon name={icon} />
              </span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.sidebarLink}>
            Siteye Dön
          </Link>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.topbarTitle}>{activeTab.label}</h1>
            <p className={styles.topbarSubtitle}>{activeTab.description}</p>
          </div>
          <div className={styles.topbarActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                sessionStorage.removeItem(TOKEN_KEY);
                setToken(null);
              }}
            >
              Çıkış
            </button>
            <button type="button" className={styles.primaryBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </header>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className={styles.content}>
          <div className={styles.panel}>
        {tab === "general" && (
          <div className={styles.grid}>
            <FieldBox
              label="İsim"
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, name: "" },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.name}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, name: e.target.value },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="Unvan"
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, title: "" },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, title: e.target.value },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="Tagline"
              fullWidth
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, tagline: "" },
                }))
              }
            >
              <textarea
                className={styles.textarea}
                value={content.personal.tagline}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, tagline: e.target.value },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="E-posta"
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    contact: { email: "" },
                  },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.contact.email}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      contact: { email: e.target.value },
                    },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="GitHub"
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    social: { ...prev.personal.social, github: "" },
                  },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.social.github}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      social: { ...prev.personal.social, github: e.target.value },
                    },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="LinkedIn"
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    social: { ...prev.personal.social, linkedin: "" },
                  },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.social.linkedin}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      social: { ...prev.personal.social, linkedin: e.target.value },
                    },
                  }))
                }
              />
            </FieldBox>

            <ExtraFieldsEditor
              title="Ek Alanlar"
              hint="Instagram, YouTube gibi sosyal medya veya ek iletişim bilgileri ekleyin."
              fields={content.personal.generalExtras}
              onChange={(generalExtras) =>
                setContent((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, generalExtras },
                }))
              }
            />
          </div>
        )}

        {tab === "about" && (
          <div className={styles.grid}>
            <FieldBox
              label="Biyografi"
              fullWidth
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    about: { ...prev.personal.about, bio: "" },
                  },
                }))
              }
            >
              <textarea
                className={styles.textarea}
                value={content.personal.about.bio}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: { ...prev.personal.about, bio: e.target.value },
                    },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="Yazılıma İlgi"
              fullWidth
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    about: { ...prev.personal.about, interest: "" },
                  },
                }))
              }
            >
              <textarea
                className={styles.textarea}
                value={content.personal.about.interest}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: { ...prev.personal.about, interest: e.target.value },
                    },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="Eğitim"
              fullWidth
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    about: {
                      ...prev.personal.about,
                      education: { title: "", period: "", description: "" },
                    },
                  },
                }))
              }
            >
              <input
                className={styles.input}
                placeholder="Eğitim başlığı"
                value={content.personal.about.education.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: {
                        ...prev.personal.about,
                        education: {
                          ...prev.personal.about.education,
                          title: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
              <input
                className={styles.input}
                placeholder="Eğitim dönemi"
                value={content.personal.about.education.period}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: {
                        ...prev.personal.about,
                        education: {
                          ...prev.personal.about.education,
                          period: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
              <textarea
                className={styles.textarea}
                placeholder="Eğitim açıklaması"
                value={content.personal.about.education.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: {
                        ...prev.personal.about,
                        education: {
                          ...prev.personal.about.education,
                          description: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="Teknolojiler (virgülle ayır)"
              fullWidth
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    about: { ...prev.personal.about, technologies: [] },
                  },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.about.technologies.join(", ")}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: {
                        ...prev.personal.about,
                        technologies: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      },
                    },
                  }))
                }
              />
            </FieldBox>
            <FieldBox
              label="Gelişim Alanları (virgülle ayır)"
              fullWidth
              onDelete={() =>
                setContent((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    about: { ...prev.personal.about, focusAreas: [] },
                  },
                }))
              }
            >
              <input
                className={styles.input}
                value={content.personal.about.focusAreas.join(", ")}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: {
                        ...prev.personal.about,
                        focusAreas: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      },
                    },
                  }))
                }
              />
            </FieldBox>

            <div className={styles.fullWidth}>
              <ExtraFieldsEditor
                title="Ek Bölümler"
                hint="Hakkımda sayfasına eklemek istediğiniz yeni başlık ve içerikleri oluşturun."
                fields={content.personal.about.extras}
                multiline
                onChange={(extras) =>
                  setContent((prev) => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      about: { ...prev.personal.about, extras },
                    },
                  }))
                }
              />
            </div>
          </div>
        )}

        {tab === "projects" && (
          <div className={styles.projectList}>
            {content.projects.map((project, index) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <h3>Proje {index + 1}</h3>
                  <DeleteButton onClick={() => removeProject(index)} label="Projeyi sil" />
                </div>
                <div className={styles.grid}>
                  <FieldBox
                    label="Proje Adı"
                    onDelete={() => updateProject(index, { ...project, name: "" })}
                  >
                    <input
                      className={styles.input}
                      value={project.name}
                      onChange={(e) =>
                        updateProject(index, { ...project, name: e.target.value })
                      }
                    />
                  </FieldBox>
                  <FieldBox
                    label="GitHub Linki"
                    onDelete={() =>
                      updateProject(index, {
                        ...project,
                        links: { ...project.links, github: undefined },
                      })
                    }
                  >
                    <input
                      className={styles.input}
                      value={project.links.github ?? ""}
                      onChange={(e) =>
                        updateProject(index, {
                          ...project,
                          links: { ...project.links, github: e.target.value || undefined },
                        })
                      }
                    />
                  </FieldBox>
                  <FieldBox
                    label="Açıklama"
                    fullWidth
                    onDelete={() => updateProject(index, { ...project, description: "" })}
                  >
                    <textarea
                      className={styles.textarea}
                      value={project.description}
                      onChange={(e) =>
                        updateProject(index, { ...project, description: e.target.value })
                      }
                    />
                  </FieldBox>
                  <FieldBox
                    label="Teknolojiler (virgülle ayır)"
                    fullWidth
                    onDelete={() => updateProject(index, { ...project, technologies: [] })}
                  >
                    <input
                      className={styles.input}
                      value={project.technologies.join(", ")}
                      onChange={(e) =>
                        updateProject(index, {
                          ...project,
                          technologies: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </FieldBox>
                  <FieldBox
                    label="Özellikler (virgülle ayır)"
                    fullWidth
                    onDelete={() => updateProject(index, { ...project, features: [] })}
                  >
                    <input
                      className={styles.input}
                      value={project.features.join(", ")}
                      onChange={(e) =>
                        updateProject(index, {
                          ...project,
                          features: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </FieldBox>
                </div>
              </div>
            ))}
            <button type="button" className={styles.secondaryBtn} onClick={addProject}>
              + Yeni Proje Ekle
            </button>
          </div>
        )}

        {tab === "colors" && (
          <div className={styles.colorsSection}>
            <div className={styles.colorsHeader}>
              <ThemeToggle />
              <button type="button" className={styles.secondaryBtn} onClick={resetTheme}>
                Sıfırla
              </button>
            </div>
            <div className={styles.colorGrid}>
              <ThemeEditor
                title="Koyu Tema"
                palette={content.theme.dark}
                onChange={(dark) => setContent((prev) => ({ ...prev, theme: { ...prev.theme, dark } }))}
              />
              <ThemeEditor
                title="Açık Tema"
                palette={content.theme.light}
                onChange={(light) =>
                  setContent((prev) => ({ ...prev, theme: { ...prev.theme, light } }))
                }
              />
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
