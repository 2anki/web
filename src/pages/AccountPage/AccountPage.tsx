import { useUserLocals } from '../../lib/hooks/useUserLocals';
import LoadingIndicator from '../../components/Loading';
import { useSubscriptionStatus } from './hooks';
import {
  UserProfile,
  PlanDetails,
  SubscriptionManagement,
  AccountDeletion,
} from './components';
import useNotionData from '../SearchPage/helpers/useNotionData';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import styles from './AccountPage.module.css';

export default function AccountPage() {
  const { isLoading, data, refetch } = useUserLocals();
  const { subscriptionStatus, subscriptionType, hasActivePlan } =
    useSubscriptionStatus(data?.locals);
  const notionData = useNotionData(get2ankiApi());

  if (isLoading) return <LoadingIndicator />;

  if (!data?.user?.email) {
    window.location.href = '/login';
    return null;
  }

  const { user, locals } = data;

  return (
    <div className={styles.page}>
      <div className={styles.mainCard}>
        <UserProfile user={user} subscriptionStatus={subscriptionStatus} />

        <h2 className={styles.sectionTitle}>Plan Details</h2>
        <PlanDetails subscriptionType={subscriptionType} />

        {notionData.connected && notionData.workSpace && (
          <>
            <h2 className={styles.sectionTitle}>Notion Workspace</h2>
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planName}>{notionData.workSpace}</span>
                <a
                  href={notionData.connectionLink}
                  className={styles.planButton}
                >
                  Switch
                </a>
              </div>
            </div>
          </>
        )}

        <SubscriptionManagement
          user={user}
          locals={locals}
          hasActivePlan={hasActivePlan}
          onRefetch={refetch}
        />

        <AccountDeletion />
      </div>
    </div>
  );
}
