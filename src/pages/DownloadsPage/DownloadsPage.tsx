import Index from './components/ListJobs';

import useUploads from './hooks/useUploads';
import useJobs from './hooks/useJobs';
import LoadingIndicator from '../../components/Loading';
import { FinishedJobs } from './components/FinishedJobs';
import { EmptyDownloadsSection } from './components/EmptyDownloadsSection';
import { Container } from '../../components/styled';
import { redirectOnError } from '../../components/shared/redirectOnError';
import { UnfinishedJobsInfo } from './components/UnfinishedJobsInfo';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';

interface DownloadsPageProps {
  setError: ErrorHandlerType;
}

export function DownloadsPage({ setError }: DownloadsPageProps) {
  const { deleteUpload, loading, uploads, error } = useUploads(get2ankiApi());
  const { jobs, deleteJob, restartJob, refreshJobs } = useJobs(get2ankiApi(), setError);
  const unfinishedJob = jobs.length > 0;

  if (error) {
    redirectOnError(error);
    return null;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <div className="section">
        <h1 className="title is-2">Downloads</h1>
        <p className="subtitle mb-6">
          Track the progress of your Notion to Anki conversions and download
          your completed flashcard decks.
        </p>

        <EmptyDownloadsSection
          hasActiveJobs={unfinishedJob}
          uploads={uploads}
        />

        {unfinishedJob && (
          <div className="mb-6">
            <UnfinishedJobsInfo visible={unfinishedJob} />
            <Index
              restartJob={restartJob}
              jobs={jobs}
              deleteJob={(id) => deleteJob(id)}
              refreshJobs={refreshJobs}
            />
          </div>
        )}

        <div className="mt-6">
          <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
        </div>
      </div>
    </Container>
  );
}
