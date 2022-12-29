import UploadObjectEntry from './components/UploadObjectEntry';
import Backend from '../../lib/backend';
import ActiveJobs from './components/ActiveJobs';

import useUploads from './hooks/useUploads';
import useActiveJobs from './hooks/useActiveJobs';
import { Container, PageContainer } from '../../components/styled';
import LoadingPage from '../Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/types';

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const [loading, uploads, deleteUpload, deleteAllUploads, isDeletingAll] =
    useUploads(backend, setError);
  const [activeJobs, deleteJob] = useActiveJobs(backend, setError);

  if (loading) {
    return <LoadingPage />;
  }

  const showActiveJobs = activeJobs.length > 0 && (
    <ActiveJobs jobs={activeJobs} deleteJob={(id) => deleteJob(id)} />
  );
  const showNoUploads = uploads.length === 0 && !loading && (
    <p>
      You have no uploads! Make some from the{' '}
      <u>
        <a href="/search">search</a>
      </u>{' '}
      page.
    </p>
  );
  const showFinishedJobs = uploads.length > 0 && (
    <>
      <h2 className="title is -2">Finished Jobs</h2>
      {uploads.map((u) => (
        <UploadObjectEntry
          data-hj-suppress
          size={`${u.size_mb ? u.size_mb.toFixed(2) : 0}`}
          key={u.key}
          title={u.filename}
          icon={null}
          url={`/api/download/u/${u.key}`}
          deleteUpload={() => deleteUpload(u.key)}
        />
      ))}
    </>
  );

  return (
    <PageContainer>
      <Container>
        <h1 className="title is-1">My Uploads</h1>
        <hr />
        {showActiveJobs}
        {showNoUploads}
        {showFinishedJobs}
        <hr />
        <button
          type="button"
          className={`button is-small ${isDeletingAll ? 'is-loading' : ''} `}
          onClick={() => {
            deleteAllUploads();
          }}
        >
          Delete All
        </button>
      </Container>
    </PageContainer>
  );
}

export default MyUploadsPage;
