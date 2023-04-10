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
import usePatreon from './hooks/usePatreon';

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const { deleteUpload, isDeleting, loading, uploads, error } =
    useUploads(backend);
  const { jobs, deleteJob, restartJob } = useJobs(backend, setError);
  const [isPatron] = usePatreon(backend);

  const unfinishedJob = jobs.length > 0;

  if (error) {
    redirectOnError(error);
    return null;
  }

  if (loading || isDeleting) {
    return <LoadingIndicator />;
  }

  if (uploads?.length === 0 && jobs.length === 0) {
    return <EmptyUploadsSection uploads={uploads} />;
  }
  return (
    <Container>
      {unfinishedJob && (
        <p>
          It might take a while for your conversion to finish. Check back later.
          {unfinishedJob && !isPatron && (
            <>
              {' '}
              For free users, <u>only one job can be processed at a time</u>,
              and there is a <strong>file size limit</strong> (~100MB).
            </>
          )}
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

export default MyUploadsPage;
