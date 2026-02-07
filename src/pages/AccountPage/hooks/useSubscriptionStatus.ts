import { useMemo } from 'react';

interface UserLocals {
  subscriber?: boolean;
  patreon?: boolean;
}

export function useSubscriptionStatus(locals: UserLocals | undefined) {
  const subscriptionStatus = useMemo(() => {
    if (locals?.subscriber) return 'Active Subscriber';
    if (locals?.patreon) return 'Lifetime Member';
    return 'Free Plan';
  }, [locals?.subscriber, locals?.patreon]);

  const subscriptionType = useMemo(() => {
    if (locals?.subscriber) return 'subscriber';
    if (locals?.patreon) return 'lifetime';
    return 'free';
  }, [locals?.subscriber, locals?.patreon]);

  const hasActivePlan = useMemo(() => {
    return Boolean(locals?.subscriber || locals?.patreon);
  }, [locals?.subscriber, locals?.patreon]);

  return {
    subscriptionStatus,
    subscriptionType,
    hasActivePlan,
  };
}
