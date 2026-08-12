import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useSiteContent } from "../../context/SiteContentContext";
import { defaultContent } from "../../data/defaultContent";
import { normalizeContent } from "../../data/normalizeContent";
import type { Project, SiteContent, ThemePalette, ContentField } from "../../types/siteContent";
import styles from "./Admin.module.css";

const TOKEN_KEY = "portfolio-admin-token";

type Tab = "general" | "about" | "projects" | "colors";

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: "general", label: "Genel", description: "İsim, iletişim ve sosyal medya" },
  { id: "about", label: "Hakkımda", description: "Biyografi, eğitim ve yetenekler" },
  { id: "projects", label: "Projeler", description: "Proje listesi ve detayları" },
  { id: "colors", label: "Renkler", description: "Açık ve koyu tema renkleri" },
];

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
            <button type="button" className={styles.dangerBtn} onClick={() => removeField(field.id)}>
              Sil
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
  const { refresh } = useSiteContent();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [tab, setTab] = useState<Tab>("general");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch("/api/admin/content", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Yetkisiz");
        return res.json() as Promise<SiteContent>;
      })
      .then((data) => setContent(normalizeContent(data)))
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
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

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(result.error ?? "Kayıt başarısız");
        return;
      }

      setStatus("Değişiklikler kaydedildi.");
      await refresh();
    } catch {
      setStatus("Kayıt sırasında hata oluştu.");
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
          <span className={styles.sidebarLogo}>AT</span>
          <div>
            <p className={styles.sidebarTitle}>Admin Panel</p>
            <p className={styles.sidebarSubtitle}>Portföy CMS</p>
          </div>
        </div>

        <nav className={styles.sidebarNav} aria-label="Admin menüsü">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.sidebarTab} ${tab === id ? styles.sidebarTabActive : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
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

        {status && (
          <p className={`${styles.statusBanner} ${status.includes("kaydedildi") ? styles.success : styles.error}`}>
            {status}
          </p>
        )}

        <div className={styles.content}>
          <div className={styles.panel}>
        {tab === "general" && (
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>İsim</span>
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
            </label>
            <label className={styles.field}>
              <span>Unvan</span>
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
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Tagline</span>
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
            </label>
            <label className={styles.field}>
              <span>E-posta</span>
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
            </label>
            <label className={styles.field}>
              <span>GitHub</span>
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
            </label>
            <label className={styles.field}>
              <span>LinkedIn</span>
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
            </label>

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
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Biyografi</span>
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
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Yazılıma İlgi</span>
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
            </label>
            <label className={styles.field}>
              <span>Eğitim Başlığı</span>
              <input
                className={styles.input}
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
            </label>
            <label className={styles.field}>
              <span>Eğitim Dönemi</span>
              <input
                className={styles.input}
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
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Eğitim Açıklaması</span>
              <textarea
                className={styles.textarea}
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
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Teknolojiler (virgülle ayır)</span>
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
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Gelişim Alanları (virgülle ayır)</span>
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
            </label>

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
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => removeProject(index)}
                  >
                    Sil
                  </button>
                </div>
                <div className={styles.grid}>
                  <label className={styles.field}>
                    <span>Proje Adı</span>
                    <input
                      className={styles.input}
                      value={project.name}
                      onChange={(e) =>
                        updateProject(index, { ...project, name: e.target.value })
                      }
                    />
                  </label>
                  <label className={styles.field}>
                    <span>GitHub Linki</span>
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
                  </label>
                  <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>Açıklama</span>
                    <textarea
                      className={styles.textarea}
                      value={project.description}
                      onChange={(e) =>
                        updateProject(index, { ...project, description: e.target.value })
                      }
                    />
                  </label>
                  <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>Teknolojiler (virgülle ayır)</span>
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
                  </label>
                  <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>Özellikler (virgülle ayır)</span>
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
                  </label>
                </div>
              </div>
            ))}
            <button type="button" className={styles.secondaryBtn} onClick={addProject}>
              + Yeni Proje Ekle
            </button>
          </div>
        )}

        {tab === "colors" && (
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
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
