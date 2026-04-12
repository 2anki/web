import { useState } from 'react';
import { getKeys } from './helpers/getKeys';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { useUserLocals } from '../../lib/hooks/useUserLocals';
import styles from '../../styles/shared.module.css';

export function DebugPage() {
  const [show, setShow] = useState(false);
  const { data } = useUserLocals();

  const resetLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={styles.pageNarrow}>
      <h1 className={styles.title}>Debug page</h1>
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
