import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cancelSubscription } from '../../../lib/backend/cancelSubscription';

export function useSubscriptionCancellation(onSuccess?: () => void) {
  const [isCancelling, setIsCancelling] = useState(false);

  const { mutate: performCancellation, isPending } = useMutation({
    mutationFn: cancelSubscription,
    onMutate: () => {
      setIsCancelling(true);
    },
    onSuccess: () => {
      setIsCancelling(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      setIsCancelling(false);
      const errorMessage =
        error?.response?.data?.message ?? 'Failed to cancel subscription';
      console.error('Subscription cancellation failed:', errorMessage);
      // Could show error notification here if needed
    },
  });

  const cancelUserSubscription = () => {
    if (
      globalThis.confirm(
        'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.'
      )
    ) {
      performCancellation();
    }
  };

  return {
    cancelUserSubscription,
    isCancelling: isPending || isCancelling,
  };
}
