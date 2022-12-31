import { useState, useEffect } from 'react';

import Backend from '../../../lib/backend';
import UserUpload from '../../../lib/interfaces/UserUpload';

interface UseUploads {
  error: unknown;
  loading: boolean;
  uploads: UserUpload[] | undefined;
}


export default function useUploads(
  backend: Backend
): UseUploads {
  const [uploads, setUploads] = useState<UserUpload[] | undefined>(undefined);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUploads() {
      try {
          return await backend.getUploads();
      } catch (fetchError) {
        setError(fetchError);
      }
      return undefined;
    }
    fetchUploads().then(data =>   {
      setUploads(data)
      setLoading(false);
    });
  }, [backend]);

  return {loading, uploads, error};
}
