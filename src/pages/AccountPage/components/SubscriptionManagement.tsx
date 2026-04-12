import React, { ChangeEvent, useEffect } from 'react';
import { useEmailLinking } from '../hooks/useEmailLinking';
import { useSubscriptionCancellation } from '../hooks/useSubscriptionCancellation';
import styles from '../AccountPage.module.css';
import sharedStyles from '../../../styles/shared.module.css';

interface User {
  email: string;
  picture?: string | null;
  name?: string;
}

interface LocalsData {
  subscriber?: boolean;
  subscriptionInfo?: {
    linked_email?: string;
    email?: string;
  };
}

interface SubscriptionManagementProps {
  readonly user: User;
  readonly locals: LocalsData;
  readonly hasActivePlan: boolean;
  readonly onRefetch: () => Promise<any>;
}

export function SubscriptionManagement({
  user,
  locals,
  hasActivePlan,
  onRefetch,
}: SubscriptionManagementProps) {
  const {
    linkEmail,
    setLinkEmail,
    linkError,
    linkSuccess,
    isLinking,
    performLinkEmail,
  } = useEmailLinking(onRefetch);

  const { cancelUserSubscription, isCancelling } =
    useSubscriptionCancellation(onRefetch);

  useEffect(() => {
    if (locals?.subscriptionInfo?.linked_email) {
      setLinkEmail(locals.subscriptionInfo.linked_email);
    }
  }, [locals?.subscriptionInfo?.linked_email, setLinkEmail]);

  const onChangeLinkEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setLinkEmail(event.target.value);
  };

  const onLink = () => {
    performLinkEmail(linkEmail);
  };

  const isEmailLinked = locals?.subscriptionInfo?.linked_email === user.email;

  if (!hasActivePlan && !user) {
    return null;
  }

  return (
    <div className={styles.managementCard}>
      <h3 className={styles.managementTitle}>Subscription Management</h3>
      {locals?.subscriber && (
        <div className={sharedStyles.marginBottomMd}>
          <p className={sharedStyles.smallDescription}>
            Manage your active subscription. You can cancel anytime and will
            retain access until the end of your current billing period.
          </p>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={cancelUserSubscription}
            disabled={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>
      )}

      <div className={sharedStyles.marginTopMd}>
        <p className={sharedStyles.smallDescription}>
          <strong>Need help?</strong>
        </p>
        <ul className={sharedStyles.featureList}>
          <li>
            Email us at <a href="mailto:support@2anki.net">support@2anki.net</a>
          </li>
        </ul>
      </div>

      {locals?.subscriber && (
        <div className={sharedStyles.marginTopLg}>
          <h4 className={sharedStyles.smallHeading}>Linked 2anki.net Email</h4>
          {isEmailLinked ? (
            <div className={styles.linkedEmail}>
              <p>
                Your subscription is managed through your Stripe account at{' '}
                <strong>{locals.subscriptionInfo?.email}</strong>. You can:
              </p>
              <ul className={sharedStyles.featureList}>
                <li>Manage your subscription</li>
                <li>Update payment details</li>
                <li>Cancel your subscription</li>
              </ul>
            </div>
          ) : (
            <div>
              <div className={styles.field}>
                <label htmlFor="subscription-email">Subscription Email</label>
                <input
                  id="subscription-email"
                  value={linkEmail}
                  onChange={onChangeLinkEmail}
                  type="email"
                  placeholder="Enter subscription email"
                  disabled={isEmailLinked}
                />
                {linkError && <p className={styles.helpDanger}>{linkError}</p>}
                {linkSuccess && (
                  <p className={styles.helpSuccess}>
                    Email linked successfully!
                  </p>
                )}
              </div>

              <button
                type="button"
                className={styles.planButton}
                onClick={onLink}
                disabled={isEmailLinked || !linkEmail.trim()}
              >
                {isLinking ? 'Linking...' : 'Link Email'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
