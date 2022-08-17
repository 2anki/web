import { captureException } from '@sentry/react';
import { useState, useEffect } from 'react';

import Backend from '../../../lib/backend';
import UserUpload from '../../../lib/interfaces/UserUpload';

export default function useUploads(
  backend: Backend
): [boolean, UserUpload[], (id: string) => void, () => void, boolean] {
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setIsDeletingAll] = useState(false);

  async function deleteUpload(key: string) {
    try {
      await backend.deleteUpload(key);
      setUploads(uploads.filter((upload: UserUpload) => upload.key !== key));
    } catch (error) {
      // TODO: handle error
      captureException(error);
    }
  }

  async function deleteAllUploads(): Promise<void> {
    setIsDeletingAll(true);
    return uploads.reduce(
      (prev, arg) => prev.then(() => deleteUpload(arg.id)),
      Promise.resolve().then(() => setIsDeletingAll(false))
    );
  }

  useEffect(() => {
    async function fetchUploads() {
      try {
        const data = await backend.getUploads();
        setUploads(data);
      } catch (error) {
        // TODO: handle error
        captureException(error);
      }
      setLoading(false);
    }
    if (uploads.length === 0) {
      fetchUploads();
    }
  }, [backend]);

  return [loading, uploads, deleteUpload, deleteAllUploads, deletingAll];
}
