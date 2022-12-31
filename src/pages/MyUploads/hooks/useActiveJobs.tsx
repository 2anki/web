import { useEffect, useState } from "react";
import {
  ErrorHandlerType,
  ErrorType
} from "../../../components/errors/helpers/types";

import Backend from "../../../lib/backend";
import { ActiveJob } from "../../../lib/types";

export default function useActiveJobs(
  backend: Backend,
  setError: ErrorHandlerType
): [ActiveJob[], (id: string) => void] {
  const [jobs, setJobs] = useState<ActiveJob[]>([]);

  async function deleteJob(id: string) {
    try {
      await backend.deleteJob(id);
      setJobs(jobs.filter((job: ActiveJob) => job.object_id !== id));
    } catch (error) {
      console.error(error)
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
