import Backend from '../../lib/backend';
import Index from './components/ListJobs';

import useUploads from './hooks/useUploads';
import useJobs from './hooks/useJobs';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/types';
import { FinishedJobs } from './components/FinishedJobs';
import { EmptyUploadsSection } from './components/EmptyUploadsSection';
import { useDeleteUpload } from './hooks/useDeleteUpload';
import { Container } from '../../components/styled';
import { redirectOnError } from '../../components/shared/redirectOnError';

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const { deleteUpload, deleteUploadError, isDeleting } =
    useDeleteUpload(backend);
  const { loading, uploads, error } = useUploads(backend);
  const { jobs, deleteJob, restartJob } = useJobs(backend, setError);

  const e = error || deleteUploadError;
  if (e) {
    redirectOnError(error);
    return null;
  }

  if (loading || isDeleting) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <Index restartJob={restartJob} jobs={jobs} deleteJob={(id) => deleteJob(id)} />
      <EmptyUploadsSection uploads={uploads} />
      <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
    </Container>
  );
}

export default MyUploadsPage;
