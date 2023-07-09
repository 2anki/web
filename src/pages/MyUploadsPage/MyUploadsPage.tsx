import Backend from '../../lib/backend';
import Index from './components/ListJobs';

import useUploads from './hooks/useUploads';
import useJobs from './hooks/useJobs';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/types';
import { FinishedJobs } from './components/FinishedJobs';
import { EmptyUploadsSection } from './components/EmptyUploadsSection';
import { Container } from '../../components/styled';
import { redirectOnError } from '../../components/shared/redirectOnError';

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

export function MyUploadsPage({ setError }: MyUploadsPageProps) {
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

  if (uploads?.length === 0 && jobs.length === 0) {
    return <EmptyUploadsSection uploads={uploads} />;
  }
  return (
    <Container>
      {unfinishedJob && (
        <p className="mt-2">
          It might take a while for your conversion to finish. Check back later.
        </p>
      )}
      <Index
        restartJob={restartJob}
        jobs={jobs}
        deleteJob={(id) => deleteJob(id)}
      />
      <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
    </Container>
  );
}
