import { useEffect, useState } from 'react';
import {
  ErrorHandlerType,
  ErrorType
} from '../../../components/errors/helpers/types';

import Backend from '../../../lib/backend';
import UserJob from '../../../lib/interfaces/UserJob';

export default function useActiveJobs(
  backend: Backend,
  setError: ErrorHandlerType
): [UserJob[], (id: string) => void] {
  const [jobs, setJobs] = useState<UserJob[]>([]);

  async function deleteJob(id: string) {
    try {
      await backend.deleteJob(id);
      setJobs(jobs.filter((job: UserJob) => job.object_id !== id));
    } catch (error) {
      setError(error as ErrorType);
    }
  }

  useEffect(() => {
    async function fetchJobs() {
      try {
        const active = await backend.getActiveJobs();
        setJobs(active);
      } catch (error) {
        setError(error as ErrorType);
      }
    }
    fetchJobs();
  }, [backend]);

  return [jobs, deleteJob];
}
