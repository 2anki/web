import { captureException } from '@sentry/react';
import { useEffect, useState } from 'react';

import Backend from '../../../lib/Backend';
import UserJob from '../../../lib/interfaces/UserJob';

export default function useActiveJobs(
  backend: Backend
): [UserJob[], (id: string) => void] {
  const [jobs, setJobs] = useState<UserJob[]>([]);

  async function deleteJob(id: string) {
    try {
      await backend.deleteJob(id);
      setJobs(jobs.filter((job: UserJob) => job.object_id !== id));
    } catch (error) {
      // TODO: handle error
      captureException(error);
    }
  }

  useEffect(() => {
    async function fetchJobs() {
      try {
        const active = await backend.getActiveJobs();
        setJobs(active);
      } catch (error) {
        // TODO: handle error
        captureException(error);
      }
    }
    fetchJobs();
  }, [backend]);

  return [jobs, deleteJob];
}
