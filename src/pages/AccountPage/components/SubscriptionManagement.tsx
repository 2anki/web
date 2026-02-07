import React, { ChangeEvent, useEffect } from 'react';
import { useEmailLinking } from '../hooks/useEmailLinking';
import { useSubscriptionCancellation } from '../hooks/useSubscriptionCancellation';

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
  user: User;
  locals: LocalsData;
  hasActivePlan: boolean;
  onRefetch: () => Promise<any>;
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
    <div className="box mt-5">
      <h3 className="title is-5">Subscription Management</h3>
      <div className="content">
        {locals?.subscriber && (
          <div className="mb-4">
            <p className="mb-3">
              Manage your active subscription. You can cancel anytime and will
              retain access until the end of your current billing period.
            </p>
            <button
              type="button"
              className={`button is-danger ${isCancelling ? 'is-loading' : ''}`}
              onClick={cancelUserSubscription}
              disabled={isCancelling}
            >
              Cancel Subscription
            </button>
          </div>
        )}

        <div className="content mt-4">
          <p>
            <strong>Need help?</strong>
          </p>
          <ul>
            <li>
              Email us at{' '}
              <a href="mailto:support@2anki.net">support@2anki.net</a>
            </li>
          </ul>
        </div>

        {locals?.subscriber && (
          <div className="mt-5">
            <h4 className="title is-6">Linked 2anki.net Email</h4>
            {isEmailLinked ? (
              <div className="notification is-success is-light">
                <p>
                  Your subscription is managed through your Stripe account at{' '}
                  <strong>{locals.subscriptionInfo?.email}</strong>. You can:
                </p>
                <ul className="mt-2">
                  <li>Manage your subscription</li>
                  <li>Update payment details</li>
                  <li>Cancel your subscription</li>
                </ul>
              </div>
            ) : (
              <div>
                <div className="field">
                  <label className="label" htmlFor="subscription-email">
                    Subscription Email
                  </label>
                  <div className={`control ${isLinking ? 'is-loading' : ''}`}>
                    <input
                      id="subscription-email"
                      value={linkEmail}
                      onChange={onChangeLinkEmail}
                      className={`input ${linkError ? 'is-danger' : ''} ${
                        linkSuccess ? 'is-success' : ''
                      }`}
                      type="email"
                      placeholder="Enter subscription email"
                      disabled={isEmailLinked}
                    />
                  </div>
                  {linkError && <p className="help is-danger">{linkError}</p>}
                  {linkSuccess && (
                    <p className="help is-success">
                      Email linked successfully!
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className={`button is-link ${isLinking ? 'is-loading' : ''}`}
                  onClick={onLink}
                  disabled={isEmailLinked || !linkEmail.trim()}
                >
                  Link Email
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
