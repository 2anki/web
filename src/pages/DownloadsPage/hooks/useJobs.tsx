import { useEffect, useState } from 'react';
import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';

import Backend from '../../../lib/backend';
import Jobs, { JobsId } from '../../../schemas/public/Jobs';

interface UseJobsResult {
  jobs: Jobs[];
  deleteJob: (id: JobsId) => Promise<void>;
  restartJob: (job: Jobs) => Promise<void>;
  refreshJobs: () => Promise<void>;
}

export default function useJobs(
  backend: Backend,
  setError: ErrorHandlerType
): UseJobsResult {
  const [jobs, setJobs] = useState<Jobs[]>([]);

  async function fetchJobs() {
    try {
      const active = await backend.getJobs();
      setJobs(active);
    } catch (error) {
      setError(error);
    }
  }

  async function deleteJob(id: JobsId) {
    try {
      await backend.deleteJob(id);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot delete job while it is in progress')) {
        setError(new Error('Cannot delete this job because it is currently running. Please wait for it to complete.'));
      } else {
        setError(error);
      }
    }
  }

  async function restartJob(job: Jobs) {
    if (job.type === 'claude') {
      await backend.restartClaudeJob(job.object_id);
    } else {
      await backend.convert(job.object_id, job.type, job.title);
    }
    await fetchJobs();
  }

  const hasActiveJobs = jobs.some(
    (j) => !['done', 'failed', 'cancelled', 'interrupted'].includes(j.status)
  );

  useEffect(() => {
    fetchJobs();
    const intervalMs = hasActiveJobs ? 3000 : 10000;
    const intervalId = setInterval(fetchJobs, intervalMs);
    return () => clearInterval(intervalId);
  }, [backend, hasActiveJobs]);

  return { jobs, deleteJob, restartJob, refreshJobs: fetchJobs };
}
