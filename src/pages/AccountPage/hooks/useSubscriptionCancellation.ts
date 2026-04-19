import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  cancelSubscription,
  CancelMode,
} from '../../../lib/backend/cancelSubscription';

const CONFIRM_MESSAGES: Record<CancelMode, string> = {
  period_end:
    'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.',
  immediate:
    'Are you sure you want to cancel your subscription immediately? You will lose access right away and will not be refunded the remainder of the current period.',
};

export function useSubscriptionCancellation(onSuccess?: () => void) {
  const [cancelError, setCancelError] = useState<string>('');
  const [cancelSuccess, setCancelSuccess] = useState<string>('');

  const { mutate, isPending: isCancelling } = useMutation({
    mutationFn: (mode: CancelMode) => cancelSubscription(mode),
    onSuccess: (data) => {
      setCancelError('');
      setCancelSuccess(
        data?.message ??
          'Your subscription change has been processed.'
      );
      onSuccess?.();
    },
    onError: (error: Error) => {
      setCancelSuccess('');
      setCancelError(error?.message || 'Failed to cancel subscription');
    },
  });

  const cancelUserSubscription = (mode: CancelMode = 'period_end') => {
    if (globalThis.confirm(CONFIRM_MESSAGES[mode])) {
      setCancelError('');
      setCancelSuccess('');
      mutate(mode);
    }
  };

  return {
    cancelUserSubscription,
    isCancelling,
    cancelError,
    cancelSuccess,
  };
}
