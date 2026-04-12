import UserUpload from '../../../lib/interfaces/UserUpload';
import styles from '../DownloadsPage.module.css';
import sharedStyles from '../../../styles/shared.module.css';

interface Prop {
  uploads: UserUpload[] | undefined;
  deleteUpload: (key: string) => void;
}

export function FinishedJobs({ uploads, deleteUpload }: Prop) {
  if (!uploads || uploads.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <img
          src="/icons/Anki_app_logo.png"
          alt="Anki Logo"
          className={styles.sectionIcon}
        />
        <h2 className={styles.sectionTitle}>Ready to Download</h2>
      </div>
      <p className={styles.sectionDescription}>
        Your flashcard decks are ready. Download them into Anki.
      </p>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th className={sharedStyles.actionColumnWide}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((u) => (
              <tr key={u.key}>
                <td>
                  <span data-hj-suppress className={styles.fileName}>
                    {u.filename}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => deleteUpload(u.key)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                    <a
                      href={`/api/download/u/${u.key}`}
                      className={styles.downloadButton}
                    >
                      Download
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
