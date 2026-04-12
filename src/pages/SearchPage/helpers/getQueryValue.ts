import { QUERY_KEY, SESSION_STORAGE_KEY } from './useSearchQuery';

export const getQueryValue = () => {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get(QUERY_KEY) ||
    sessionStorage.getItem(SESSION_STORAGE_KEY) ||
    'anki'
  );
};
