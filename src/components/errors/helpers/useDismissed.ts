import { useEffect, useState } from 'react';

import { ErrorType } from './types';

export const useDismissed = (error: ErrorType) => {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (error) {
      setDismissed(false);
    }
  }, [error]);

  return { dismissed, setDismissed };
};
