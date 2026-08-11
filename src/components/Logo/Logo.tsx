import { personal } from "../../data/personal";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="7"
            y="28"
            fill="#fafafa"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="22"
            fontWeight="300"
          >
            A
          </text>
          <text
            x="19"
            y="28"
            fill="#89cff0"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="24"
            fontWeight="700"
          >
            T
          </text>
        </svg>
      </div>

      <div className={styles.text}>
        <span className={styles.name}>{personal.name}</span>
        <span className={styles.subtitle}>{personal.logoSubtitle}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    </div>
  );
}
