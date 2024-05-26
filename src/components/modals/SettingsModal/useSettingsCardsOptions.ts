import { useQuery } from 'react-query';
import { getSettingsCardOptions } from '../../../lib/backend/getSettingsCardOptions';
import { FIFTEEN_MINUTES } from './constants';

export const useSettingsCardsOptions = (pageId: string | null) => {
  const { isLoading, isError, data: options, error: loadingDefaultsError } = useQuery(
    `cardOptions-${pageId ?? 'default'}`, // pageId will invalidate the cache
    getSettingsCardOptions,
    {
      staleTime: FIFTEEN_MINUTES
    }
  );

  return { isLoading, isError, options, loadingDefaultsError };
};
