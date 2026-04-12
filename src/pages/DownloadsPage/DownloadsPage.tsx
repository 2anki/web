import Index from './components/ListJobs';

import useUploads from './hooks/useUploads';
import useJobs from './hooks/useJobs';
import LoadingIndicator from '../../components/Loading';
import { FinishedJobs } from './components/FinishedJobs';
import { EmptyDownloadsSection } from './components/EmptyDownloadsSection';
import { redirectOnError } from '../../components/shared/redirectOnError';
import { UnfinishedJobsInfo } from './components/UnfinishedJobsInfo';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import styles from './DownloadsPage.module.css';

interface DownloadsPageProps {
  setError: ErrorHandlerType;
}

export function DownloadsPage({ setError }: DownloadsPageProps) {
  const { deleteUpload, loading, uploads, error } = useUploads(get2ankiApi());
  const { jobs, deleteJob, restartJob, refreshJobs } = useJobs(
    get2ankiApi(),
    setError
  );
  const unfinishedJob = jobs.length > 0;

  if (error) {
    redirectOnError(error);
    return null;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Downloads</h1>
        <p className={styles.subtitle}>
          Track your conversions and download completed flashcard decks.
        </p>
      </div>

      <EmptyDownloadsSection hasActiveJobs={unfinishedJob} uploads={uploads} />

      {unfinishedJob && (
        <div className={styles.section}>
          <UnfinishedJobsInfo />
          <Index
            restartJob={restartJob}
            jobs={jobs}
            deleteJob={(id) => deleteJob(id)}
            refreshJobs={refreshJobs}
          />
        </div>
      )}

      <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
    </div>
  );
}
