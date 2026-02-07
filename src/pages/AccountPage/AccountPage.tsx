import React from 'react';
import { useUserLocals } from '../../lib/hooks/useUserLocals';
import { PageContainer } from '../../components/styled';
import LoadingIndicator from '../../components/Loading';
import { useSubscriptionStatus } from './hooks';
import {
  UserProfile,
  PlanDetails,
  SubscriptionManagement,
  AccountDeletion,
} from './components';

export default function AccountPage() {
  const { isLoading, data, refetch } = useUserLocals();
  const { subscriptionStatus, subscriptionType, hasActivePlan } =
    useSubscriptionStatus(data?.locals);

  if (isLoading) return <LoadingIndicator />;

  if (!data?.user?.email) {
    window.location.href = '/login';
    return null;
  }

  const { user, locals } = data;

  return (
    <PageContainer>
      <div className="box">
        <UserProfile user={user} subscriptionStatus={subscriptionStatus} />

        <div className="content mt-5">
          <h2 className="title is-4">Plan Details</h2>
          <PlanDetails subscriptionType={subscriptionType} />

          <SubscriptionManagement
            user={user}
            locals={locals}
            hasActivePlan={hasActivePlan}
            onRefetch={refetch}
          />

          <AccountDeletion />
        </div>
      </div>
    </PageContainer>
  );
}
