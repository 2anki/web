import { useState, useEffect } from 'react';

import Backend from '../../../lib/backend';
import UserUpload from '../../../lib/interfaces/UserUpload';

interface UseUploads {
  error: unknown;
  loading: boolean;
  uploads: UserUpload[] | undefined;
  deleteUpload: (key: string) => Promise<void>;
  deleteAllUploads: () => void;
  isDeletingAll: boolean
}


export default function useUploads(
  backend: Backend
): UseUploads {
  const [error, setError] = useState<unknown>(null);
  const [uploads, setUploads] = useState<UserUpload[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isDeletingAll, setIsIsDeletingAll] = useState(false);

  async function deleteUpload(key: string) {
    try {
      await backend.deleteUpload(key);
      if (uploads) {
        setUploads(uploads.filter((upload: UserUpload) => upload.key !== key));
      } else {
        setError(new Error('Did not receive any uploads'));
      }
    } catch (deleteError) {
      setError(deleteError);
    }
  }

  async function deleteAllUploads(): Promise<boolean> {
    try {
      setIsIsDeletingAll(true);
          await uploads?.reduce(
        (prev, arg) => prev.then(() => deleteUpload(arg.key)),
        Promise.resolve().then(() => setIsIsDeletingAll(false))
      );
        return true;
    } catch (deleteAllError) {
      setError(deleteAllError)
    }
    return false;
  }

  useEffect(() => {
    async function fetchUploads() {
      setLoading(true);
      try {
        const data = await backend.getUploads();
        setUploads(data);
      } catch (fetchError) {
        setError(fetchError);
      }
      setLoading(false);
    }
    if (uploads?.length === 0) {
      fetchUploads();
    }
  }, [backend]);

  return {loading, uploads, deleteUpload, deleteAllUploads, isDeletingAll, error};
}
