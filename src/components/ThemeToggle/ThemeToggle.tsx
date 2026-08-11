import { useTheme } from "../../context/ThemeContext";
import styles from "./ThemeToggle.module.css";

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 1111.5 3a6.5 6.5 0 109.5 11.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Tema</span>
      <div className={styles.toggle} role="group" aria-label="Tema seçimi">
        <span
          className={`${styles.indicator} ${theme === "light" ? styles.indicatorLight : ""}`}
          aria-hidden="true"
        />
        <button
          type="button"
          className={`${styles.option} ${theme === "dark" ? styles.optionActive : ""}`}
          onClick={() => setTheme("dark")}
          aria-label="Koyu tema"
          aria-pressed={theme === "dark"}
        >
          <MoonIcon />
        </button>
        <button
          type="button"
          className={`${styles.option} ${theme === "light" ? styles.optionActive : ""}`}
          onClick={() => setTheme("light")}
          aria-label="Açık tema"
          aria-pressed={theme === "light"}
        >
          <SunIcon />
        </button>
      </div>
    </div>
  );
}
