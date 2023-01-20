import { useState } from 'react';
import Backend from '../../../lib/backend';

interface UseDeleteUpload {
  isDeleting: boolean;
  deleteUploadError: unknown;
  deleteUpload: (key: string) => Promise<void>;
}

export const useDeleteUpload = (backend: Backend): UseDeleteUpload => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteUploadError, setError] = useState<unknown>(undefined);

  const deleteUpload = async (key: string) => {
    setIsDeleting(true);
    try {
      await backend.deleteUpload(key);
    } catch (error) {
      setError(error);
    }
    setIsDeleting(false);
  };

  return { isDeleting, deleteUploadError, deleteUpload };
};
