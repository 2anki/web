import {
  useCallback, useEffect, useState,
} from 'react';

import Backend from '../../../lib/Backend';
import useQuery from '../../../lib/hooks/useQuery';
import NotionObject from '../../../lib/interfaces/NotionObject';

interface SearchQuery {
  isLoading: boolean;
  myPages: NotionObject[];
  setError: (error: string) => void;
  inProgress: boolean;
  triggerSearch: (force: boolean) => void;
  errorNotification: string;
  setSearchQuery: (query: string) => void;
}

export default function useSearchQuery(backend: Backend): SearchQuery {
  const query = useQuery();

  const [searchQuery, setSearchQuery] = useState(query.get('q') || '');
  const [myPages, setMyPages] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [errorNotification, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const triggerSearch = useCallback(
    (force) => {
      if (inProgress) {
        return;
      }
      setError(null);
      setInProgress(true);
      backend
        .search(searchQuery, force)
        .then((results) => {
          setMyPages(results);
          setInProgress(false);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setInProgress(false);
        });
    },
    [inProgress, searchQuery],
  );

  useEffect(() => {
    setIsLoading(true);
    triggerSearch(true);
  }, []);

  return {
    myPages,
    setError,
    inProgress,
    triggerSearch,
    errorNotification,
    isLoading,
    setSearchQuery,
  };
}
