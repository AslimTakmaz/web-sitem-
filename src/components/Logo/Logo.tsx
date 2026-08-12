import styles from "./Logo.module.css";

export function Logo() {
  return (
    <div className={styles.logo} aria-hidden="true">
      <div className={styles.mark}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.5 28.5L15.5 11.5L22.5 28.5"
            className={styles.letterA}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 22.5H20"
            className={styles.letterA}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17.5 10.5H31.5V14H26.25V28.5H22.75V14H17.5V10.5Z"
            className={styles.letterT}
          />
          <path
            d="M6 34H34"
            className={styles.accentLine}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
