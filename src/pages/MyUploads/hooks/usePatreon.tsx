import { useEffect, useState } from 'react';
import {
  ErrorHandlerType,
  ErrorType
} from '../../../components/errors/helpers/types';

import Backend from '../../../lib/backend';

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
      } catch (error) {
        setError(error as ErrorType);
      }
    }
    if (!isPatron) {
      fetchIsPatreon();
    }
  }, [isPatron]);

  return [isPatron];
}
