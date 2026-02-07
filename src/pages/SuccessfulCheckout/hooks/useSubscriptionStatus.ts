import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface SubscriptionStatus {
  authenticated: boolean;
  hasActiveSubscription: boolean;
  user?: {
    email: string;
    name: string;
    patreon: boolean;
  };
}

const fetchSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const response = await fetch('/api/stripe/subscription-status', {
    credentials: 'include',
  });
  return response.json();
};

export const useSubscriptionStatus = () => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const query = useQuery({
    queryKey: ['subscription-status'],
    queryFn: fetchSubscriptionStatus,
    refetchInterval: shouldPoll ? 2000 : false,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
      setShouldPoll(false);
    }, 90000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (query.data) {
      // Stop polling if user is not authenticated
      if (!query.data.authenticated) {
        setShouldPoll(false);
      }

      // Redirect if user has active subscription
      if (query.data.hasActiveSubscription) {
        globalThis.location.href = '/search';
      }
    }
  }, [query.data]);

  return {
    ...query,
    timeoutReached,
    shouldShowLoading:
      query.isLoading ||
      (shouldPoll &&
        query.data?.authenticated &&
        !query.data?.hasActiveSubscription),
  };
};
