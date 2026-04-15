import { useState } from 'react';

import UserUpload from '../../../lib/interfaces/UserUpload';
import Jobs, { JobsId } from '../../../schemas/public/Jobs';
import { getDistance } from '../../../lib/getDistance';
import styles from '../DownloadsPage.module.css';
import sharedStyles from '../../../styles/shared.module.css';

interface Prop {
  uploads: UserUpload[] | undefined;
  deleteUpload: (key: string) => Promise<void>;
  doneJobs?: Jobs[];
  deleteJob?: (id: JobsId) => void;
}

export function FinishedJobs({ uploads, deleteUpload, doneJobs = [], deleteJob }: Prop) {
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  if ((!uploads || uploads.length === 0) && doneJobs.length === 0) {
    return null;
  }

  const handleDelete = async (key: string) => {
    setDeletingKey(key);
    try {
      await deleteUpload(key);
    } finally {
      setDeletingKey(null);
    }
  };

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
              <th>Created</th>
              <th className={sharedStyles.actionColumnWide}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doneJobs.map((j) => (
              <tr key={j.id}>
                <td>
                  <span data-hj-suppress className={styles.fileName}>
                    {j.title}
                  </span>
                </td>
                <td>
                  {j.created_at && (
                    <span className={styles.timeAgo}>
                      {getDistance(j.created_at)} ago
                    </span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    {deleteJob && (
                      <button
                        type="button"
                        onClick={() => deleteJob(j.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    )}
                    <a
                      href={`/api/upload/jobs/${j.object_id}/download`}
                      className={styles.downloadButton}
                    >
                      Download
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {(uploads ?? []).map((u) => (
              <tr key={u.key}>
                <td>
                  <span data-hj-suppress className={styles.fileName}>
                    {u.filename}
                  </span>
                </td>
                <td>
                  {u.created_at && (
                    <span className={styles.timeAgo}>
                      {getDistance(u.created_at)} ago
                    </span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => handleDelete(u.key)}
                      className={styles.deleteButton}
                      disabled={deletingKey === u.key}
                    >
                      {deletingKey === u.key ? 'Deleting...' : 'Delete'}
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
