import { useEffect, useState } from 'react';
import {
  ErrorHandlerType,
  ErrorType
} from '../../../components/errors/helpers/types';

import Backend from '../../../lib/backend';

export const IS_PATREON_KEY = 'is-patreon';

export default function usePatreon(
  backend: Backend,
  setError: ErrorHandlerType
): [boolean] {
  const [isPatron, setIsPatreon] = useState(false);

  useEffect(() => {
    async function fetchIsPatreon() {
      try {
        const is = await backend.isPatreon();
        setIsPatreon(is);
        if (is !== undefined) {
          localStorage.setItem(IS_PATREON_KEY, is.toString());
        }
      } catch (error) {
        setError(error as ErrorType);
        localStorage.removeItem(IS_PATREON_KEY);
      }
    }
    if (!isPatron) {
      fetchIsPatreon();
    }
  }, [isPatron]);

  return [isPatron];
}
