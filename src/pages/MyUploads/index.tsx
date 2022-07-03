import UploadObjectEntry from './components/UploadObjectEntry';
import Backend from '../../lib/Backend';
import ActiveJobs from './components/ActiveJobs';

import useUploads from './hooks/useUploads';
import usePatreon from './hooks/usePatreon';
import useQuota from './hooks/useQuota';
import useActiveJobs from './hooks/useActiveJobs';
import { Container, PageContainer } from '../../components/styled';
import LoadingPage from '../Loading';
import { ImposedLimits } from './components/ImposedLimits';

const backend = new Backend();

interface MyUploadsPageProps {
  setError: (error: string) => void;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const [loading, uploads, deleteUpload, deleteAllUploads, isDeletingAll] =
    useUploads(backend, setError);
  const [activeJobs, deleteJob] = useActiveJobs(backend, setError);
  const [isPatreon] = usePatreon(backend, setError);
  const [quota] = useQuota(uploads);

  if (loading) {
    return <LoadingPage />;
  }

  console.log('uploads is', uploads);

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
          isPatreon={isPatreon}
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
  const showQuotaUsage = uploads.length > 0 && (
    <div className="card">
      <header className="card-header" />
      <div className="card-content">
        You have used {quota.toFixed(2)} MB
        {!isPatreon && ' of your quota (21MB)'}.
        <div className="is-pulled-right my-2">
          <button
            type="button"
            className={`button is-small ${isDeletingAll ? 'is-loading' : ''} `}
            onClick={() => {
              deleteAllUploads();
            }}
          >
            Delete All
          </button>
        </div>
        <progress
          className={`progress ${quota > 16 ? 'is-danger' : 'is-info'}`}
          value={quota}
          max={21}
        >
          15%
        </progress>
      </div>
      {!isPatreon && <ImposedLimits />}
    </div>
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
        {showQuotaUsage}
      </Container>
    </PageContainer>
  );
}

export default MyUploadsPage;
