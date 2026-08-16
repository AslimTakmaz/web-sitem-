import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { GitHubIcon, LinkedInIcon } from "../../components/icons/SocialIcons";
import { defaultContent } from "../../data/defaultContent";
import {
  SOCIAL_PLATFORMS,
  SocialPlatformIcon,
  findPlatformByLabel,
  type SocialPlatformId,
} from "../../data/socialPlatforms";
import { normalizeHexColor } from "../../lib/themeStorage";
import type {
  ContactMessage,
  Experience,
  Project,
  SiteContent,
  Skill,
  SkillCategory,
  SkillLevel,
  ThemePalette,
} from "../../types/siteContent";
import { IconEdit, IconPlus, IconTrash } from "./AdminIcons";
import styles from "./Admin.module.css";

const ACTIVITY_KEY = "admin-recent-activities";

const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  learning: "Öğreniyorum",
  using: "Kullanıyorum",
  good: "İyi",
};

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Veritabanı",
  other: "Diğer",
};

export interface SectionProps {
  content: SiteContent;
  setContent: Dispatch<SetStateAction<SiteContent>>;
  onSaveActivity?: (text: string) => void;
}

function Field({
  label,
  children,
  fullWidth,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <label className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {action}
      </div>
      {children}
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
  const pickerValue = normalizeHexColor(value, "#000000");
  return (
    <label className={styles.colorField}>
      <span>{label}</span>
      <div className={styles.colorInputRow}>
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(normalizeHexColor(e.target.value, pickerValue))}
        />
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
      <h4 className={styles.themeTitle}>{title}</h4>
      <ColorField label="Ana renk" value={palette.accent} onChange={(v) => update("accent", v)} />
      <ColorField label="Hover rengi" value={palette.accentHover} onChange={(v) => update("accentHover", v)} />
      <ColorField label="Vurgu rengi" value={palette.babyBlue} onChange={(v) => update("babyBlue", v)} />
      <ColorField label="Etiket rengi" value={palette.label} onChange={(v) => update("label", v)} />
    </div>
  );
}

function VisitorChart() {
  const points = [32, 48, 40, 62, 55, 78, 68];
  const width = 320;
  const height = 80;
  const max = Math.max(...points);
  const coords = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (value / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function getRecentActivities(): { text: string; time: string }[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as { text: string; time: string }[];
  } catch {
    return [];
  }
}

export function pushActivity(text: string) {
  const activities = getRecentActivities();
  const entry = { text, time: new Date().toLocaleString("tr-TR") };
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify([entry, ...activities].slice(0, 8)));
}

export function DashboardSection({ content }: SectionProps) {
  const techCount = useMemo(() => {
    const fromProjects = content.projects.flatMap((p) => p.technologies);
    const fromAbout = content.personal.about.technologies;
    const fromSkills = content.skills.map((s) => s.name);
    return new Set([...fromProjects, ...fromAbout, ...fromSkills]).size;
  }, [content]);

  const activities = getRecentActivities();
  const messageCount = content.messages?.length ?? 0;

  const stats = [
    { label: "Toplam Ziyaretçi", value: "—", hint: "Vercel Analytics ile", trend: null },
    { label: "Toplam Proje", value: String(content.projects.length), hint: null, trend: null },
    { label: "Gelen Mesaj", value: String(messageCount), hint: null, trend: null },
    { label: "Teknoloji", value: String(techCount), hint: null, trend: null },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
            {stat.hint && <p className={styles.statHint}>{stat.hint}</p>}
          </div>
        ))}
      </div>

      <div className={styles.dashboardRow}>
        <Card title="Son 7 Gün Ziyaretçi Grafiği">
          <VisitorChart />
          <p className={styles.chartNote}>Gerçek veriler Vercel Analytics bağlandığında görünür.</p>
        </Card>

        <Card title="Son Aktiviteler">
          {activities.length === 0 ? (
            <p className={styles.emptyText}>Henüz kayıt yok. İçerik kaydettiğinizde burada görünür.</p>
          ) : (
            <ul className={styles.activityList}>
              {activities.map((item, index) => (
                <li key={`${item.time}-${index}`} className={styles.activityItem}>
                  <span>{item.text}</span>
                  <time>{item.time}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export function AboutSection({ content, setContent }: SectionProps) {
  const { about } = content.personal;

  return (
    <div className={styles.formGrid}>
      <Field label="Biyografi" fullWidth>
        <textarea
          className={styles.textarea}
          value={about.bio}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: { ...prev.personal, about: { ...about, bio: e.target.value } },
            }))
          }
        />
      </Field>
      <Field label="Yazılıma İlgi" fullWidth>
        <textarea
          className={styles.textarea}
          value={about.interest}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: { ...prev.personal, about: { ...about, interest: e.target.value } },
            }))
          }
        />
      </Field>
      <Field label="Eğitim Başlığı">
        <input
          className={styles.input}
          value={about.education.title}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                about: {
                  ...about,
                  education: { ...about.education, title: e.target.value },
                },
              },
            }))
          }
        />
      </Field>
      <Field label="Eğitim Dönemi">
        <input
          className={styles.input}
          value={about.education.period}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                about: {
                  ...about,
                  education: { ...about.education, period: e.target.value },
                },
              },
            }))
          }
        />
      </Field>
      <Field label="Eğitim Açıklaması" fullWidth>
        <textarea
          className={styles.textarea}
          value={about.education.description}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                about: {
                  ...about,
                  education: { ...about.education, description: e.target.value },
                },
              },
            }))
          }
        />
      </Field>
      <Field label="Gelişim Alanları (virgülle)" fullWidth>
        <input
          className={styles.input}
          value={about.focusAreas.join(", ")}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                about: {
                  ...about,
                  focusAreas: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                },
              },
            }))
          }
        />
      </Field>
    </div>
  );
}

export function ExperienceSection({ content, setContent }: SectionProps) {
  const update = (index: number, patch: Partial<Experience>) => {
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const add = () => {
    setContent((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: crypto.randomUUID(),
          title: "Yeni Deneyim",
          organization: "",
          period: "",
          description: "",
        },
      ],
    }));
  };

  const remove = (index: number) => {
    const item = content.experiences[index];
    if (!item || !window.confirm(`"${item.title}" deneyimini silmek istediğine emin misin?`)) return;
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.stack}>
      {content.experiences.map((exp, index) => (
        <div key={exp.id} className={styles.listCard}>
          <div className={styles.listCardHeader}>
            <h4>{exp.title || `Deneyim ${index + 1}`}</h4>
            <button type="button" className={styles.iconBtn} onClick={() => remove(index)} aria-label="Sil">
              <IconTrash />
            </button>
          </div>
          <div className={styles.formGrid}>
            <Field label="Başlık">
              <input className={styles.input} value={exp.title} onChange={(e) => update(index, { title: e.target.value })} />
            </Field>
            <Field label="Kurum / Şirket">
              <input className={styles.input} value={exp.organization} onChange={(e) => update(index, { organization: e.target.value })} />
            </Field>
            <Field label="Dönem">
              <input className={styles.input} value={exp.period} onChange={(e) => update(index, { period: e.target.value })} />
            </Field>
            <Field label="Açıklama" fullWidth>
              <textarea className={styles.textarea} value={exp.description} onChange={(e) => update(index, { description: e.target.value })} />
            </Field>
          </div>
        </div>
      ))}
      <button type="button" className={styles.secondaryBtn} onClick={add}>
        <IconPlus /> Deneyim Ekle
      </button>
    </div>
  );
}

function ProjectEditModal({
  project,
  onClose,
  onSave,
}: {
  project: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
}) {
  const [draft, setDraft] = useState(project);

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h3>Proje Düzenle</h3>
          <button type="button" className={styles.iconBtnNeutral} onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>
        <div className={styles.formGrid}>
          <Field label="Proje Adı" fullWidth>
            <input className={styles.input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Görsel URL">
            <input className={styles.input} value={draft.imageUrl ?? ""} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value || undefined })} placeholder="https://..." />
          </Field>
          <Field label="GitHub">
            <input className={styles.input} value={draft.links.github ?? ""} onChange={(e) => setDraft({ ...draft, links: { ...draft.links, github: e.target.value || undefined } })} />
          </Field>
          <Field label="Demo">
            <input className={styles.input} value={draft.links.demo ?? ""} onChange={(e) => setDraft({ ...draft, links: { ...draft.links, demo: e.target.value || undefined } })} />
          </Field>
          <Field label="Durum">
            <select
              className={styles.input}
              value={draft.status ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  status: e.target.value === "completed" || e.target.value === "in-progress" ? e.target.value : undefined,
                })
              }
            >
              <option value="">Belirtilmedi</option>
              <option value="completed">Tamamlandı</option>
              <option value="in-progress">Devam ediyor</option>
            </select>
          </Field>
          <Field label="Yayın Durumu">
            <select
              className={styles.input}
              value={draft.published === false ? "draft" : "published"}
              onChange={(e) => setDraft({ ...draft, published: e.target.value === "published" })}
            >
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </Field>
          <Field label="Açıklama" fullWidth>
            <textarea className={styles.textarea} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Teknolojiler (virgülle)" fullWidth>
            <input
              className={styles.input}
              value={draft.technologies.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </Field>
          <Field label="Özellikler (virgülle)" fullWidth>
            <input
              className={styles.input}
              value={draft.features.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </Field>
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>İptal</button>
          <button type="button" className={styles.primaryBtn} onClick={() => { onSave(draft); onClose(); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ content, setContent }: SectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updateProject = (index: number, project: Project) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) => (i === index ? project : item)),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "Yeni Proje",
      description: "Proje açıklaması",
      technologies: ["React"],
      features: ["Özellik ekleyin"],
      published: true,
      links: {},
    };
    setContent((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
    setEditingIndex(content.projects.length);
  };

  const removeProject = (index: number) => {
    const project = content.projects[index];
    if (!project || !window.confirm(`"${project.name}" projesini silmek istediğine emin misin?`)) return;
    setContent((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  return (
    <div className={styles.stack}>
      <div className={styles.tableToolbar}>
        <p className={styles.tableHint}>{content.projects.length} proje</p>
        <button type="button" className={styles.primaryBtn} onClick={addProject}>
          <IconPlus /> Yeni Proje Ekle
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Kapak</th>
              <th>Proje Adı</th>
              <th>Teknolojiler</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {content.projects.map((project, index) => (
              <tr key={project.id}>
                <td>
                  <div className={styles.thumb}>
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="" />
                    ) : (
                      <span>{project.name.charAt(0)}</span>
                    )}
                  </div>
                </td>
                <td>
                  <strong>{project.name}</strong>
                  <p className={styles.tableSub}>{project.description.slice(0, 60)}…</p>
                </td>
                <td>
                  <div className={styles.pillRow}>
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className={styles.pill}>{tech}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${project.published === false ? styles.badgeDraft : styles.badgeLive}`}>
                    {project.published === false ? "Taslak" : "Yayında"}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <button type="button" className={styles.iconBtnNeutral} onClick={() => setEditingIndex(index)} aria-label="Düzenle">
                      <IconEdit />
                    </button>
                    <button type="button" className={styles.iconBtn} onClick={() => removeProject(index)} aria-label="Sil">
                      <IconTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingIndex !== null && content.projects[editingIndex] && (
        <ProjectEditModal
          project={content.projects[editingIndex]}
          onClose={() => setEditingIndex(null)}
          onSave={(project) => updateProject(editingIndex, project)}
        />
      )}
    </div>
  );
}

export function SkillsSection({ content, setContent }: SectionProps) {
  const grouped = useMemo(() => {
    const groups: Record<SkillCategory, Skill[]> = {
      frontend: [],
      backend: [],
      database: [],
      other: [],
    };
    for (const skill of content.skills) {
      groups[skill.category].push(skill);
    }
    return groups;
  }, [content.skills]);

  const update = (index: number, patch: Partial<Skill>) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const add = (category: SkillCategory) => {
    setContent((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: crypto.randomUUID(), name: "Yeni Yetenek", category, level: "learning" },
      ],
    }));
  };

  const remove = (index: number) => {
    setContent((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const findIndex = (id: string) => content.skills.findIndex((s) => s.id === id);

  return (
    <div className={styles.stack}>
      {(Object.keys(grouped) as SkillCategory[]).map((category) => (
        <Card
          key={category}
          title={SKILL_CATEGORY_LABELS[category]}
          action={
            <button type="button" className={styles.secondaryBtnSmall} onClick={() => add(category)}>
              + Ekle
            </button>
          }
        >
          {grouped[category].length === 0 ? (
            <p className={styles.emptyText}>Bu kategoride yetenek yok.</p>
          ) : (
            <ul className={styles.skillList}>
              {grouped[category].map((skill) => {
                const index = findIndex(skill.id);
                return (
                  <li key={skill.id} className={styles.skillItem}>
                    <input
                      className={styles.inputInline}
                      value={skill.name}
                      onChange={(e) => update(index, { name: e.target.value })}
                    />
                    <select
                      className={styles.selectInline}
                      value={skill.level}
                      onChange={(e) => update(index, { level: e.target.value as SkillLevel })}
                    >
                      {Object.entries(SKILL_LEVEL_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <button type="button" className={styles.iconBtn} onClick={() => remove(index)} aria-label="Sil">
                      <IconTrash />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}

export function MessagesSection({
  content,
  setContent,
  token,
  onUnauthorized,
}: SectionProps & {
  token: string;
  onUnauthorized: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tokenRef = useRef(token);
  const onUnauthorizedRef = useRef(onUnauthorized);
  const setContentRef = useRef(setContent);

  useEffect(() => {
    tokenRef.current = token;
    onUnauthorizedRef.current = onUnauthorized;
    setContentRef.current = setContent;
  }, [token, onUnauthorized, setContent]);

  const messages = content.messages ?? [];
  const filtered = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  const refreshMessages = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(`/api/admin/messages?_=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });

      if (response.status === 401) {
        onUnauthorizedRef.current();
        return;
      }

      if (!response.ok) {
        setError("Mesajlar yüklenemedi.");
        return;
      }

      const data = (await response.json()) as { messages?: ContactMessage[] };
      setContentRef.current((prev) => ({ ...prev, messages: data.messages ?? [] }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Mesaj yükleme zaman aşımı.");
        return;
      }
      setError("Mesajlar yüklenemedi.");
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMessages();
  }, [refreshMessages]);

  const persistMessages = async (next: ContactMessage[]) => {
    setSaving(true);
    setError("");
    const previous = messages;
    setContent((prev) => ({ ...prev, messages: next }));

    try {
      const response = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      if (!response.ok) {
        setContent((prev) => ({ ...prev, messages: previous }));
        setError("Mesaj güncellenemedi. Tekrar deneyin.");
        return;
      }

      const data = (await response.json()) as { messages?: ContactMessage[] };
      setContent((prev) => ({ ...prev, messages: data.messages ?? next }));
    } catch {
      setContent((prev) => ({ ...prev, messages: previous }));
      setError("Mesaj güncellenemedi. Bağlantıyı kontrol edin.");
    } finally {
      setSaving(false);
    }
  };

  const markRead = (id: string) => {
    void persistMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)),
    );
  };

  const removeMessage = (id: string) => {
    if (!window.confirm("Bu mesajı silmek istediğine emin misin?")) return;
    void persistMessages(messages.filter((msg) => msg.id !== id));
  };

  return (
    <div className={styles.stack}>
      <div className={styles.tableToolbar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === "all" ? styles.tabBtnActive : ""}`}
            onClick={() => setFilter("all")}
          >
            Tümü ({messages.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === "unread" ? styles.tabBtnActive : ""}`}
            onClick={() => setFilter("unread")}
          >
            Okunmamış ({messages.filter((m) => !m.read).length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === "read" ? styles.tabBtnActive : ""}`}
            onClick={() => setFilter("read")}
          >
            Okundu ({messages.filter((m) => m.read).length})
          </button>
        </div>
        <button
          type="button"
          className={styles.secondaryBtnSmall}
          onClick={() => void refreshMessages()}
          disabled={loading || saving}
        >
          {loading ? "Yükleniyor..." : saving ? "Kaydediliyor..." : "Yenile"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Henüz mesaj yok.</p>
          <p className={styles.emptyHint}>
            Sitenin altındaki iletişim formundan gelen mesajlar burada listelenir.
          </p>
        </div>
      ) : (
        <ul className={styles.messageList}>
          {filtered.map((msg) => (
            <li key={msg.id} className={`${styles.messageItem} ${msg.read ? styles.messageRead : ""}`}>
              <div className={styles.messageHeader}>
                <div>
                  <strong>{msg.name}</strong>
                  <span className={styles.messageEmail}>{msg.email}</span>
                </div>
                <time className={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleString("tr-TR")}
                </time>
              </div>
              <p className={styles.messageSubject}>{msg.subject}</p>
              <p className={styles.messageBody}>{msg.message}</p>
              <div className={styles.messageActions}>
                {!msg.read && (
                  <button
                    type="button"
                    className={styles.secondaryBtnSmall}
                    onClick={() => markRead(msg.id)}
                    disabled={saving || loading}
                  >
                    {saving ? "Kaydediliyor..." : "Okundu işaretle"}
                  </button>
                )}
                {msg.read && <span className={styles.badgeLive}>Okundu</span>}
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => removeMessage(msg.id)}
                  aria-label="Sil"
                  disabled={saving || loading}
                >
                  <IconTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SocialSection({ content, setContent }: SectionProps) {
  const { personal } = content;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<SocialPlatformId | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const usedLabels = useMemo(
    () => new Set(personal.generalExtras.map((field) => field.label.trim().toLowerCase())),
    [personal.generalExtras],
  );

  const selectedPlatform = SOCIAL_PLATFORMS.find((platform) => platform.id === selectedId) ?? null;

  const updateExtra = (id: string, patch: { label?: string; value?: string }) => {
    setContent((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        generalExtras: prev.personal.generalExtras.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      },
    }));
  };

  const openPicker = () => {
    setSelectedId(null);
    setUrlDraft("");
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setSelectedId(null);
    setUrlDraft("");
  };

  const addSelectedPlatform = () => {
    if (!selectedPlatform) return;

    const label = selectedPlatform.label;
    const alreadyAdded = usedLabels.has(label.toLowerCase());
    if (alreadyAdded && selectedPlatform.id !== "custom") return;

    setContent((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        generalExtras: [
          ...prev.personal.generalExtras,
          {
            id: crypto.randomUUID(),
            label,
            value: urlDraft.trim(),
          },
        ],
      },
    }));
    closePicker();
  };

  const removeExtra = (id: string) => {
    setContent((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        generalExtras: prev.personal.generalExtras.filter((f) => f.id !== id),
      },
    }));
  };

  return (
    <div className={styles.stack}>
      <div className={styles.formGrid}>
        <Field label="GitHub">
          <div className={styles.socialPrimaryRow}>
            <span className={styles.socialPrimaryIcon} aria-hidden="true">
              <GitHubIcon />
            </span>
            <input
              className={styles.input}
              value={personal.social.github}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, social: { ...prev.personal.social, github: e.target.value } },
                }))
              }
            />
          </div>
        </Field>
        <Field label="LinkedIn">
          <div className={styles.socialPrimaryRow}>
            <span className={styles.socialPrimaryIcon} aria-hidden="true">
              <LinkedInIcon />
            </span>
            <input
              className={styles.input}
              value={personal.social.linkedin}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, social: { ...prev.personal.social, linkedin: e.target.value } },
                }))
              }
            />
          </div>
        </Field>
      </div>

      <Card
        title="Diğer Sosyal Medya"
        action={
          <button type="button" className={styles.secondaryBtnSmall} onClick={openPicker}>
            + Ekle
          </button>
        }
      >
        {personal.generalExtras.length === 0 ? (
          <p className={styles.emptyText}>Instagram, YouTube vb. eklemek için + Ekle’ye bas.</p>
        ) : (
          <ul className={styles.socialList}>
            {personal.generalExtras.map((field) => {
              const platform = findPlatformByLabel(field.label);
              return (
                <li key={field.id} className={styles.socialItem}>
                  <span
                    className={styles.socialItemIcon}
                    style={platform ? { color: platform.color } : undefined}
                    aria-hidden="true"
                  >
                    <SocialPlatformIcon id={platform?.id ?? "custom"} />
                  </span>
                  <input
                    className={styles.input}
                    value={field.label}
                    onChange={(e) => updateExtra(field.id, { label: e.target.value })}
                    placeholder="Platform"
                  />
                  <input
                    className={styles.input}
                    value={field.value}
                    onChange={(e) => updateExtra(field.id, { value: e.target.value })}
                    placeholder={platform?.placeholder ?? "https://..."}
                  />
                  <button type="button" className={styles.iconBtn} onClick={() => removeExtra(field.id)} aria-label="Sil">
                    <IconTrash />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {pickerOpen && (
        <div className={styles.modalOverlay} onClick={closePicker} role="presentation">
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="social-picker-title"
          >
            <div className={styles.modalHeader}>
              <h3 id="social-picker-title">Sosyal medya seç</h3>
              <button type="button" className={styles.iconBtnNeutral} onClick={closePicker} aria-label="Kapat">
                ×
              </button>
            </div>

            <div className={styles.platformGrid}>
              {SOCIAL_PLATFORMS.map((platform) => {
                const added = usedLabels.has(platform.label.toLowerCase()) && platform.id !== "custom";
                const active = selectedId === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    className={`${styles.platformCard} ${active ? styles.platformCardActive : ""} ${added ? styles.platformCardDisabled : ""}`}
                    onClick={() => {
                      if (added) return;
                      setSelectedId(platform.id);
                      setUrlDraft("");
                    }}
                    disabled={added}
                    title={added ? "Zaten eklendi" : platform.label}
                  >
                    <span className={styles.platformIcon} style={{ color: platform.color }}>
                      <SocialPlatformIcon id={platform.id} />
                    </span>
                    <span className={styles.platformLabel}>{platform.label}</span>
                    {added && <span className={styles.platformBadge}>Eklendi</span>}
                  </button>
                );
              })}
            </div>

            {selectedPlatform && (
              <div className={styles.platformForm}>
                <Field label={`${selectedPlatform.label} linki`} fullWidth>
                  <input
                    className={styles.input}
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    placeholder={selectedPlatform.placeholder}
                    autoFocus
                  />
                </Field>
              </div>
            )}

            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={closePicker}>
                İptal
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={addSelectedPlatform}
                disabled={!selectedPlatform}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ColorsSection({
  content,
  setContent,
  onReset,
}: SectionProps & { onReset: () => void }) {
  const updateTheme = (patch: (theme: SiteContent["theme"]) => SiteContent["theme"]) => {
    setContent((prev) => ({ ...prev, theme: patch(prev.theme) }));
  };

  return (
    <div className={styles.stack}>
      <div className={styles.colorsToolbar}>
        <div className={styles.livePreview}>
          <span className={styles.liveDot} />
          Canlı Önizleme
        </div>
        <ThemeToggle />
        <button type="button" className={styles.secondaryBtn} onClick={onReset}>Sıfırla</button>
      </div>

      <div className={styles.previewCard}>
        <div className={styles.previewHero}>
          <span className={styles.previewBadge}>Önizleme</span>
          <h4>{content.personal.name}</h4>
          <p>{content.personal.title}</p>
          <button type="button" className={styles.previewBtn}>Örnek Buton</button>
        </div>
      </div>

      <div className={styles.colorGrid}>
        <ThemeEditor
          title="Koyu Tema"
          palette={content.theme.dark}
          onChange={(dark) => updateTheme((theme) => ({ ...theme, dark }))}
        />
        <ThemeEditor
          title="Açık Tema"
          palette={content.theme.light}
          onChange={(light) => updateTheme((theme) => ({ ...theme, light }))}
        />
      </div>
    </div>
  );
}

export function SeoSection({ content, setContent }: SectionProps) {
  return (
    <div className={styles.formGrid}>
      <Field label="Sayfa Başlığı (title)" fullWidth>
        <input
          className={styles.input}
          value={content.seo.title}
          onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
        />
      </Field>
      <Field label="Meta Açıklama" fullWidth>
        <textarea
          className={styles.textarea}
          value={content.seo.description}
          onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
        />
      </Field>
      <Field label="Anahtar Kelimeler" fullWidth>
        <input
          className={styles.input}
          value={content.seo.keywords}
          onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }))}
        />
      </Field>
      <p className={`${styles.fieldHint} ${styles.fullWidth}`}>
        SEO alanları kaydedildiğinde site meta etiketlerine yansıtılabilir.
      </p>
    </div>
  );
}

export function SettingsSection({ content, setContent }: SectionProps) {
  const { personal } = content;

  return (
    <div className={styles.formGrid}>
      <Field label="İsim">
        <input className={styles.input} value={personal.name} onChange={(e) => setContent((prev) => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))} />
      </Field>
      <Field label="Unvan">
        <input className={styles.input} value={personal.title} onChange={(e) => setContent((prev) => ({ ...prev, personal: { ...prev.personal, title: e.target.value } }))} />
      </Field>
      <Field label="Durum Satırı">
        <input className={styles.input} value={personal.statusLine ?? ""} onChange={(e) => setContent((prev) => ({ ...prev, personal: { ...prev.personal, statusLine: e.target.value || undefined } }))} placeholder="Staj arıyorum..." />
      </Field>
      <Field label="E-posta">
        <input
          className={styles.input}
          value={personal.contact.email}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                contact: { ...prev.personal.contact, email: e.target.value },
              },
            }))
          }
        />
      </Field>
      <Field label="Telefon">
        <input
          className={styles.input}
          value={personal.contact.phone ?? ""}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                contact: { ...prev.personal.contact, phone: e.target.value || undefined },
              },
            }))
          }
          placeholder="+90 5xx xxx xx xx"
        />
      </Field>
      <Field label="Konum">
        <input
          className={styles.input}
          value={personal.contact.location ?? ""}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                contact: { ...prev.personal.contact, location: e.target.value || undefined },
              },
            }))
          }
          placeholder="İstanbul, Türkiye"
        />
      </Field>
      <Field label="İletişim Metni" fullWidth>
        <textarea
          className={styles.textarea}
          value={personal.contact.intro ?? ""}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              personal: {
                ...prev.personal,
                contact: { ...prev.personal.contact, intro: e.target.value || undefined },
              },
            }))
          }
        />
      </Field>
      <Field label="Site URL" fullWidth>
        <input className={styles.input} value={personal.siteUrl} onChange={(e) => setContent((prev) => ({ ...prev, personal: { ...prev.personal, siteUrl: e.target.value } }))} />
      </Field>
      <Field label="Profil Görseli URL" fullWidth>
        <input className={styles.input} value={personal.profileImage ?? ""} onChange={(e) => setContent((prev) => ({ ...prev, personal: { ...prev.personal, profileImage: e.target.value || undefined } }))} placeholder="https://..." />
      </Field>
      <Field label="Tagline" fullWidth>
        <textarea className={styles.textarea} value={personal.tagline} onChange={(e) => setContent((prev) => ({ ...prev, personal: { ...prev.personal, tagline: e.target.value } }))} />
      </Field>
    </div>
  );
}

export function resetThemeContent(setContent: Dispatch<SetStateAction<SiteContent>>) {
  setContent((prev) => ({
    ...prev,
    theme: {
      dark: { ...defaultContent.theme.dark },
      light: { ...defaultContent.theme.light },
    },
  }));
}
