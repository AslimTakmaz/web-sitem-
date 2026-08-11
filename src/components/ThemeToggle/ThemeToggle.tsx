import { useTheme } from "../../context/ThemeContext";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.toggle} role="group" aria-label="Tema seçimi">
      <button
        type="button"
        className={`${styles.button} ${theme === "dark" ? styles.active : ""}`}
        onClick={() => setTheme("dark")}
        aria-label="Koyu tema"
        aria-pressed={theme === "dark"}
      >
        <span className={styles.darkSwatch} />
      </button>
      <button
        type="button"
        className={`${styles.button} ${theme === "light" ? styles.active : ""}`}
        onClick={() => setTheme("light")}
        aria-label="Açık tema"
        aria-pressed={theme === "light"}
      >
        <span className={styles.lightSwatch} />
      </button>
    </div>
  );
}
