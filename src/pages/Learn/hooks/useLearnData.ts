import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';
import NotionObject from '../../../lib/interfaces/NotionObject';
import { ChildrenType } from '../types';

interface LearnData {
  error: Error | null;
  page: NotionObject | null;
  children: ChildrenType | null;
}

export const useLearnData = (
  id: string | null,
  refetch: boolean
): LearnData => {
  const [page, setPage] = useState<NotionObject | null>(null);
  const [error, setError] = useState(null);
  const [children, setChildren] = useState<ChildrenType | null>(null);
  const backend = new Backend();

  useEffect(() => {
    if (id && id !== 'learn') {
      backend
        .getPage(id)
        .then((res) => setPage(res))
        .catch(setError);
      backend
        .getBlocks(id)
        .then((response) => {
          setChildren(response.results);
        })
        .catch(setError);
    }
  }, [id, refetch]);

  return {
    error,
    page,
    children
  };
};
