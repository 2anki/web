import styles from './TemplatesSkeleton.module.css';

export function TemplatesSkeleton() {
  return (
    <div className={styles.skeletonShell} aria-hidden="true">
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop} />
        <div className={styles.sidebarRow} />
        <div className={styles.sidebarRow} />
        <div className={styles.sidebarRow} />
        <div className={styles.sidebarRow} />
        <div className={styles.sidebarRow} />
      </aside>
      <main className={styles.canvas}>
        <div className={styles.canvasHeader} />
        <div className={styles.canvasRow} />
        <div className={styles.canvasRow} />
        <div className={styles.canvasGrid}>
          <div className={styles.canvasCell} />
          <div className={styles.canvasCell} />
        </div>
      </main>
    </div>
  );
}
