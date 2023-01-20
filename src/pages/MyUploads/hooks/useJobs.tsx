import { useEffect, useState } from 'react';
import {
  ErrorHandlerType,
  ErrorType
} from '../../../components/errors/helpers/types';

import Backend from '../../../lib/backend';
import Jobs from '../../../schemas/public/Jobs';

export default function useJobs(
  backend: Backend,
  setError: ErrorHandlerType
): [Jobs[], (id: string) => void] {
  const [jobs, setJobs] = useState<Jobs[]>([]);

  async function deleteJob(id: string) {
    try {
      await backend.deleteJob(id);
      setJobs(jobs.filter((job: Jobs) => job.object_id !== id));
    } catch (error) {
      console.error(error);
      setError(error as ErrorType);
    }
  }

  useEffect(() => {
    async function fetchJobs() {
      try {
        const active = await backend.getJobs();
        setJobs(active);
      } catch (error) {
        setError(error as ErrorType);
      }
    }

    fetchJobs();
  }, [backend]);

  return [jobs, deleteJob];
}
