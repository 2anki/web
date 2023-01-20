import { useState } from 'react';
import Backend from '../../../lib/backend';

interface UseDeleteAll {
  isDeletingAll: boolean;
  deleteAllError: unknown;
  deleteAllUploads: () => Promise<void>;
}

export const useDeleteAll = (
  backend: Backend,
  uploadsIds: string[]
): UseDeleteAll => {
  const [isDeletingAll, setIsIsDeletingAll] = useState(false);
  const [deleteAllError, setError] = useState<unknown>(undefined);

  async function deleteAllUploads() {
    try {
      setIsIsDeletingAll(true);
      await Promise.all(uploadsIds.map((id) => backend.deleteUpload(id)));
      setIsIsDeletingAll(false);
    } catch (error) {
      setError(error);
    }
  }

  return { deleteAllError, isDeletingAll, deleteAllUploads };
};
