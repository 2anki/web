import { captureException } from '@sentry/react';
import { useEffect, useState } from 'react';

import Backend from '../../../lib/Backend';

export default function usePatreon(backend: Backend) {
  const [isPatron, setIsPatreon] = useState(false);

  useEffect(() => {
    async function fetchIsPatreon() {
      try {
        const is = await backend.isPatreon();
        setIsPatreon(is);
      } catch (error) {
        // TODO: handle error
        captureException(error);
      }
    }
    if (!isPatron) {
      fetchIsPatreon();
    }
  }, [isPatron]);

  return [isPatron];
}
