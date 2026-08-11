import { personal } from "../../data/personal";
import styles from "./About.module.css";

export function About() {
  const { about } = personal;

  return (
    <section id="about" className={styles.section} aria-label="Hakkımda">
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.sectionLabel}>Hakkımda</p>
          <h2 className={styles.sectionTitle}>Kim olduğum</h2>
        </header>

        <div className={styles.grid}>
          <div className={styles.textBlock}>
            <div>
              <h3 className={styles.subheading}>Biyografi</h3>
              <p className={styles.paragraph}>{about.bio}</p>
            </div>
            <div>
              <h3 className={styles.subheading}>Yazılıma İlgi</h3>
              <p className={styles.paragraph}>{about.interest}</p>
            </div>
            <div>
              <h3 className={styles.subheading}>Eğitim</h3>
              <div className={styles.education}>
                <p className={styles.educationTitle}>{about.education.title}</p>
                <p className={styles.educationPeriod}>{about.education.period}</p>
                <p className={styles.educationDescription}>
                  {about.education.description}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.textBlock}>
            <div>
              <h3 className={styles.subheading}>Kullandığım Teknolojiler</h3>
              <ul className={styles.techList}>
                {about.technologies.map((tech) => (
                  <li key={tech} className={styles.techTag}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.subheading}>Gelişim Alanları</h3>
              <ul className={styles.focusList}>
                {about.focusAreas.map((area) => (
                  <li key={area} className={styles.focusItem}>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
