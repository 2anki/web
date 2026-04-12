import { getErrorMessage } from './helpers/getErrorMessage';
import { useDismissed } from './helpers/useDismissed';
import styles from '../../styles/shared.module.css';

interface ErrorPresenterProps {
  error: unknown;
}

export function ErrorPresenter({ error }: ErrorPresenterProps) {
  const { dismissed, setDismissed } = useDismissed(error);

  if (!error || dismissed) {
    return null;
  }

  return (
    <article className={styles.alertInfo}>
      <div className={styles.modalBody}>
        <div dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }} />
      </div>
      <div className={styles.modalFooter}>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => setDismissed(true)}
        >
          Close
        </button>
      </div>
    </article>
  );
}
