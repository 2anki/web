import Backend from '../../lib/backend';
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

const backend = new Backend();

interface DownloadsPageProps {
  setError: ErrorHandlerType;
}

export function DownloadsPage({ setError }: DownloadsPageProps) {
  const { deleteUpload, loading, uploads, error } = useUploads(backend);
  const { jobs, deleteJob, restartJob } = useJobs(backend, setError);
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
      <EmptyDownloadsSection hasActiveJobs={unfinishedJob} uploads={uploads} />
      <UnfinishedJobsInfo visible={unfinishedJob} />
      <Index
        restartJob={restartJob}
        jobs={jobs}
        deleteJob={(id) => deleteJob(id)}
      />
      <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
    </Container>
  );
}
