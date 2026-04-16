import { useState } from 'react';
import { getKeys } from './helpers/getKeys';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { useUserLocals } from '../../lib/hooks/useUserLocals';
import styles from '../../styles/shared.module.css';
import debugStyles from './DebugPage.module.css';

const SHARE_FILES_KEY = 'share-files-for-debugging';

export function DebugPage() {
  const [show, setShow] = useState(false);
  const [shareFiles, setShareFiles] = useState(
    localStorage.getItem(SHARE_FILES_KEY) === 'true'
  );
  const { data } = useUserLocals();

  const resetLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toggleShareFiles = () => {
    const next = !shareFiles;
    setShareFiles(next);
    localStorage.setItem(SHARE_FILES_KEY, String(next));
  };

  return (
    <div className={styles.pageNarrow}>
      <h1 className={styles.title}>Debug page</h1>

      <section className={debugStyles.shareCard}>
        <div className={debugStyles.shareHeader}>
          <span className={debugStyles.shareBadge}>Opt-in</span>
          Help us fix bugs faster
        </div>
        <p className={debugStyles.shareDescription}>
          When a conversion fails, enabling this sends the uploaded files and
          error details to the 2anki team so we can reproduce and fix the
          issue. It is <strong>off by default</strong> to keep your notes
          private. Turn it on before filing a bug report so your next failed
          upload reaches us.
        </p>
        <div className={debugStyles.shareControls}>
          <label className={debugStyles.shareToggle}>
            <input
              type="checkbox"
              checked={shareFiles}
              onChange={toggleShareFiles}
            />
            Share files when a conversion fails
          </label>
          <span
            className={`${debugStyles.shareStatus} ${
              shareFiles
                ? debugStyles.shareStatusOn
                : debugStyles.shareStatusOff
            }`}
          >
            {shareFiles ? 'On — files will be sent on failure' : 'Off — nothing is sent'}
          </span>
        </div>
      </section>

      <h2 className={styles.subtitle}>User Locals</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h2 className={`${styles.subtitle} ${styles.sectionHeading}`}>
        Local Storage
      </h2>
      <pre>
        {getKeys(localStorage).map(
          (key) =>
            `localStorage.setItem(${key}, ${JSON.stringify(
              localStorage.getItem(key)
            )});\n`
        )}
      </pre>
      <div className={styles.debugActions}>
        <button
          className={styles.btnOutline}
          type="button"
          onClick={() => setShow(!show)}
        >
          {show ? 'Hide' : 'Show'}
        </button>
        {show && <ErrorPresenter error={new Error('This is a test error')} />}
        <button
          className={styles.btnOutline}
          type="button"
          onClick={resetLocalStorage}
        >
          Reset local storage
        </button>
      </div>
    </div>
  );
}
