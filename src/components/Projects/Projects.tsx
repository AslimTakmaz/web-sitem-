import { useEffect, useState } from "react";
import type { Project } from "../../data/projects";
import { projects } from "../../data/projects";
import { CloseIcon, ExternalLinkIcon } from "../icons/SocialIcons";
import styles from "./Projects.module.css";

const statusLabels: Record<NonNullable<Project["status"]>, string> = {
  "in-progress": "Devam ediyor",
  completed: "Tamamlandı",
};

function ProjectStatusBadge({ status }: { status: NonNullable<Project["status"]> }) {
  return (
    <span
      className={`${styles.statusBadge} ${
        status === "in-progress" ? styles.statusInProgress : styles.statusCompleted
      }`}
    >
      {statusLabels[status]}
    </span>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <h3 id="modal-title" className={styles.modalTitle}>
              {project.name}
            </h3>
            {project.status && <ProjectStatusBadge status={project.status} />}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Kapat"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>{project.description}</p>

          <p className={styles.featuresTitle}>Özellikler</p>
          <div className={styles.featuresGrid}>
            {project.features.map((feature) => (
              <div key={feature} className={styles.featureItem}>
                {feature}
              </div>
            ))}
          </div>

          <div className={styles.modalActions}>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                <ExternalLinkIcon />
                GitHub
              </a>
            )}
            {project.links.demo && project.links.demo !== "#" && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                <ExternalLinkIcon />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [modalOpen, setModalOpen] = useState(false);
  const hasDemo = project.links.demo && project.links.demo !== "#";

  return (
    <>
      <article className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{project.name}</h3>
          {project.status && <ProjectStatusBadge status={project.status} />}
        </div>
        <p className={styles.cardDescription}>{project.description}</p>

        <ul className={styles.techList}>
          {project.technologies.map((tech) => (
            <li key={tech} className={styles.techTag}>
              {tech}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setModalOpen(true)}
          >
            Detayları Gör
          </button>
          {hasDemo ? (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
            >
              <ExternalLinkIcon />
              Demo
            </a>
          ) : (
            <span
              className={styles.btnGhost}
              style={{ opacity: 0.4, cursor: "not-allowed" }}
              title="Demo bağlantısı henüz eklenmedi"
            >
              Demo
            </span>
          )}
        </div>
      </article>

      {modalOpen && (
        <ProjectModal project={project} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

export function Projects() {
  return (
    <section id="projects" className={styles.section} aria-label="Projeler">
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.sectionLabel}>Projeler</p>
          <h2 className={styles.sectionTitle}>Çalışmalarım</h2>
        </header>

        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
