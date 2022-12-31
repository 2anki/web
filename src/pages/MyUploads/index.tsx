import Backend from '../../lib/backend';
import ActiveJobs from './components/ActiveJobs';

import useUploads from './hooks/useUploads';
import useActiveJobs from './hooks/useActiveJobs';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType, ErrorType } from '../../components/errors/helpers/types';
import { FinishedJobs } from './components/FinishedJobs';
import { EmptyUploadsSection } from './components/EmptyUploadsSection';
import { DeleteAllButton } from './components/DeleteAllButton';

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const {loading, uploads, deleteUpload, deleteAllUploads, isDeletingAll, error} =
    useUploads(backend);
  const [activeJobs, deleteJob] = useActiveJobs(backend, setError);

  if (error) {
    setError(error as ErrorType);
    return null;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <section className="section">
        <div className="container">
          <div className="is-flex is-justify-content-space-between">
            <h1 className="title">My Uploads</h1>
            <DeleteAllButton
              uploads={uploads}
              isDeletingAll={isDeletingAll}
                             deleteAllUploads={deleteAllUploads} />
          </div>
          <ActiveJobs jobs={activeJobs} deleteJob={(id) => deleteJob(id)} />
          <EmptyUploadsSection uploads={uploads} />
          <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
        </div>
      </section>
  );
}

export default MyUploadsPage;
