import { useClaudeProgress } from './hooks/useClaudeProgress';
import styles from '../../../../styles/shared.module.css';

interface Props {
  active: boolean;
}

export function ClaudeProgress({ active }: Readonly<Props>) {
  const { label, progress } = useClaudeProgress(active);

  if (!active) return null;

  return (
    <div className={`${styles.textCenter} ${styles.marginTopMd}`}>
      <p className={styles.claudeText}>✨ {label}</p>
      <progress className={styles.progressBar} value={progress} max={100} />
    </div>
  );
}
