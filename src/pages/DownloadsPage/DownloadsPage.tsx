import { useQuery } from 'react-query';
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
import { getUserLocals } from '../../lib/backend/getUserLocals';

interface DownloadsPageProps {
  setError: ErrorHandlerType;
}

export function DownloadsPage({ setError }: DownloadsPageProps) {
  const { deleteUpload, loading, uploads, error } = useUploads(get2ankiApi());
  const { jobs, deleteJob, restartJob } = useJobs(get2ankiApi(), setError);
  const { isLoading, data } = useQuery('userlocals', getUserLocals, {
    cacheTime: 0,
  });
  const unfinishedJob = jobs.length > 0;
  const isPremium = data?.locals?.patreon || data?.locals?.subscriber;

  if (error) {
    redirectOnError(error);
    return null;
  }

  if (loading || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <div className="section">
        <EmptyDownloadsSection
          hasActiveJobs={unfinishedJob}
          uploads={uploads}
        />

        {!isPremium && (
          <div className="notification is-warning is-light mb-5">
            <p>
              Free users can only download 100 cards at a time and only one
              conversion at a time. If you trigger more than one conversion at a
              time, the oldest one will be cancelled.
            </p>
          </div>
        )}

        {unfinishedJob && (
          <div className="mb-6">
            <UnfinishedJobsInfo visible={unfinishedJob} />
            <Index
              restartJob={restartJob}
              jobs={jobs}
              deleteJob={(id) => deleteJob(id)}
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
