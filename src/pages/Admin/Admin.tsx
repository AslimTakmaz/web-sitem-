import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/Logo/Logo";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { applyTheme, useSiteContent } from "../../context/SiteContentContext";
import { defaultContent } from "../../data/defaultContent";
import { normalizeContent } from "../../data/normalizeContent";
import {
  applyThemePreview,
  getCachedContent,
  persistContentCache,
} from "../../lib/themeStorage";
import type { SiteContent } from "../../types/siteContent";
import {
  IconAbout,
  IconColors,
  IconCv,
  IconDashboard,
  IconExperience,
  IconLogout,
  IconMessages,
  IconProjects,
  IconSeo,
  IconSettings,
  IconSkills,
  IconSocial,
} from "./AdminIcons";
import {
  AboutSection,
  ColorsSection,
  CvSection,
  DashboardSection,
  ExperienceSection,
  MessagesSection,
  ProjectsSection,
  SeoSection,
  SettingsSection,
  SkillsSection,
  SocialSection,
  pushActivity,
  resetThemeContent,
} from "./AdminSections";
import styles from "./Admin.module.css";

const TOKEN_KEY = "portfolio-admin-token";

type Tab =
  | "dashboard"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "messages"
  | "cv"
  | "social"
  | "colors"
  | "seo"
  | "settings";

const TABS: {
  id: Tab;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: number;
}[] = [
  { id: "dashboard", label: "Genel", description: "Dashboard ve özet istatistikler", icon: <IconDashboard /> },
  { id: "about", label: "Hakkımda", description: "Biyografi, eğitim ve ilgi alanları", icon: <IconAbout /> },
  { id: "experience", label: "Deneyimler", description: "İş, staj ve eğitim geçmişi", icon: <IconExperience /> },
  { id: "projects", label: "Projeler", description: "Proje listesi ve kapak görselleri", icon: <IconProjects /> },
  { id: "skills", label: "Yetenekler", description: "Teknik beceriler ve seviyeler", icon: <IconSkills /> },
  { id: "messages", label: "Mesajlar", description: "Gelen iletişim mesajları", icon: <IconMessages />, badge: 0 },
  { id: "cv", label: "CV", description: "Özgeçmiş dosyası yönetimi", icon: <IconCv /> },
  { id: "social", label: "Sosyal Medya", description: "GitHub, LinkedIn ve diğer linkler", icon: <IconSocial /> },
  { id: "colors", label: "Renkler", description: "Açık ve koyu tema renkleri", icon: <IconColors /> },
  { id: "seo", label: "SEO", description: "Arama motoru optimizasyonu", icon: <IconSeo /> },
  { id: "settings", label: "Ayarlar", description: "Genel site ve profil ayarları", icon: <IconSettings /> },
];

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
  }, [message, type, onClose]);

  return (
    <div className={`${styles.toast} ${type === "success" ? styles.toastSuccess : styles.toastError}`} role="status">
      {message}
    </div>
  );
}

export function AdminPage() {
  const { applySavedContent } = useSiteContent();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent>(() => getCachedContent() ?? defaultContent);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [usingDefaultContent, setUsingDefaultContent] = useState(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    if (tab === "colors") {
      applyThemePreview(content.theme);
    }
  }, [content.theme, tab]);

  const dismissToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const logout = useCallback(
    (message = "Oturum süresi doldu. Tekrar giriş yapın.") => {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      showToast(message, "error");
    },
    [showToast],
  );

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    setContentLoading(true);

    fetch(`/api/admin/content?_=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          logout();
          throw new Error("Yetkisiz");
        }
        if (!res.ok) throw new Error("İçerik yüklenemedi");

        setUsingDefaultContent(res.headers.get("X-Content-Source") === "default");
        const data = (await res.json()) as SiteContent;
        const normalized = normalizeContent(data);
        setContent(normalized);
        applyTheme(normalized.theme);
        persistContentCache(normalized);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error instanceof Error && error.message === "Yetkisiz") return;
        showToast("İçerik yüklenemedi. Sayfayı yenileyip tekrar deneyin.", "error");
      })
      .finally(() => {
        if (!controller.signal.aborted) setContentLoading(false);
      });

    return () => controller.abort();
  }, [token, logout, showToast]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      let result: { token?: string; error?: string } = {};
      try {
        result = (await response.json()) as { token?: string; error?: string };
      } catch {
        setLoginError("Sunucu yanıtı okunamadı");
        return;
      }

      if (!response.ok || !result.token) {
        setLoginError(result.error ?? "Giriş başarısız");
        return;
      }

      sessionStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setPassword("");
    } catch {
      setLoginError("Sunucuya bağlanılamadı");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    setToast(null);
    const payload = contentRef.current;

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      let result: SiteContent | { error?: string };
      try {
        result = (await response.json()) as SiteContent | { error?: string };
      } catch {
        showToast("Sunucu yanıtı okunamadı", "error");
        return;
      }

      if (!response.ok) {
        showToast("error" in result ? result.error ?? "Kayıt başarısız" : "Kayıt başarısız", "error");
        return;
      }

      const saved = normalizeContent(result as SiteContent);
      setContent(saved);
      applySavedContent(saved);
      persistContentCache(saved);
      applyTheme(saved.theme);
      setUsingDefaultContent(false);
      pushActivity(`${TABS.find((t) => t.id === tab)?.label ?? "İçerik"} kaydedildi`);
      showToast("Değişiklikler kaydedildi.", "success");
    } catch {
      showToast("Kayıt sırasında hata oluştu.", "error");
    } finally {
      setSaving(false);
    }
  };

  const resetTheme = () => {
    resetThemeContent(setContent);
    applyThemePreview(defaultContent.theme);
    showToast("Renkler varsayılana sıfırlandı. Kalıcı olması için Kaydet'e basın.", "success");
  };

  if (!token) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <p className={styles.loginBadge}>Admin Panel</p>
          <h1 className={styles.loginTitle}>Giriş Yap</h1>
          <p className={styles.loginSubtitle}>Site içeriğini düzenlemek için giriş yapın.</p>
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
            <button type="submit" className={styles.primaryBtn} disabled={loggingIn}>
              {loggingIn ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          <Link to="/" className={styles.backLink}>← Siteye dön</Link>
        </div>
      </div>
    );
  }

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];
  const sectionProps = { content, setContent };

  const renderSection = () => {
    switch (tab) {
      case "dashboard":
        return <DashboardSection {...sectionProps} />;
      case "about":
        return <AboutSection {...sectionProps} />;
      case "experience":
        return <ExperienceSection {...sectionProps} />;
      case "projects":
        return <ProjectsSection {...sectionProps} />;
      case "skills":
        return <SkillsSection {...sectionProps} />;
      case "messages":
        return <MessagesSection />;
      case "cv":
        return <CvSection {...sectionProps} />;
      case "social":
        return <SocialSection {...sectionProps} />;
      case "colors":
        return <ColorsSection {...sectionProps} onReset={resetTheme} />;
      case "seo":
        return <SeoSection {...sectionProps} />;
      case "settings":
        return <SettingsSection {...sectionProps} />;
    }
  };

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
          {TABS.map(({ id, label, icon, badge }) => (
            <button
              key={id}
              type="button"
              className={`${styles.sidebarTab} ${tab === id ? styles.sidebarTabActive : ""}`}
              onClick={() => setTab(id)}
            >
              {icon}
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className={styles.badge}>{badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.sidebarLink}>
            <span>← Siteye Dön</span>
          </Link>
          <button
            type="button"
            className={styles.sidebarLink}
            onClick={() => {
              sessionStorage.removeItem(TOKEN_KEY);
              setToken(null);
            }}
          >
            <IconLogout />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.topbarTitle}>{activeTab.label}</h1>
            <p className={styles.topbarSubtitle}>{activeTab.description}</p>
          </div>
          <div className={styles.topbarActions}>
            <ThemeToggle />
            <button type="button" className={styles.primaryBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </header>

        {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}

        {usingDefaultContent && (
          <p className={styles.statusBanner}>
            Canlı depolama okunamadı — varsayılan içerik gösteriliyor. Kaydettiğinizde Blob bağlantısı kurulmuş olmalı.
          </p>
        )}

        <div className={styles.content}>
          <div className={styles.panel}>
            {contentLoading && <div className={styles.loadingOverlay}>İçerik yükleniyor...</div>}
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
