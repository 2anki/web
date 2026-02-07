import React, { useState, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useUserLocals } from '../../lib/hooks/useUserLocals';
import { PageContainer } from '../../components/styled';
import LoadingIndicator from '../../components/Loading';
import { postLinkEmail } from '../../lib/backend/postLinkEmail';
import { getPaymentPortalLink } from './helpers/getPaymentPortalLink';

export default function AccountPage() {
  const { isLoading, data, refetch } = useUserLocals();
  const [linkEmail, setLinkEmail] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');
  const [linkSuccess, setLinkSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (data?.linked_email) {
      setLinkEmail(data.linked_email);
    }
  }, [data]);

  const { mutate: linkEmailMutate, isPending: isLinking } = useMutation({
    mutationFn: (email: string) => postLinkEmail(email),
    onError: (error: any) => {
      setLinkSuccess(false);
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Failed to link email';
      setLinkError(message);
    },
    onSuccess: async () => {
      setLinkError('');
      setLinkSuccess(true);
      await refetch();
    },
  });

  if (isLoading) return <LoadingIndicator />;
  if (!data?.user?.email) {
    window.location.href = '/login';
    return null;
  }

  const { user, locals } = data;
  const getSubscriptionStatus = () => {
    if (locals?.subscriber) return 'Active Subscriber';
    if (locals?.patreon) return 'Lifetime Member';
    return 'Free Plan';
  };
  const subscriptionStatus = getSubscriptionStatus();

  const onChangeLinkEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setLinkEmail(event.target.value);
  };

  const onLink = () => {
    linkEmailMutate(linkEmail);
  };

  return (
    <PageContainer>
      <div className="box">
        {/* Profile */}
        <div className="columns">
          <div className="column is-one-quarter">
            <figure className="image is-128x128 mb-4">
              <img
                className="is-rounded"
                src={
                  user.picture ??
                  `https://www.gravatar.com/avatar/${user.email}?s=128&d=mp`
                }
                alt="User avatar"
                data-hj-suppress
              />
            </figure>
          </div>
          <div className="column">
            <div className="level is-mobile">
              <div className="level-left">
                <div>
                  <h1 className="title mb-2" data-hj-suppress>
                    {user.name}
                  </h1>
                  <p className="subtitle is-6 mb-2" data-hj-suppress>
                    {user.email}
                  </p>
                  <div className="tags">
                    <span className="tag is-primary is-medium">
                      {subscriptionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="content mt-5">
          <h2 className="title is-4">Plan Details</h2>
          {locals?.subscriber && (
            <div className="box">
              <div className="level">
                <div className="level-left">
                  <div>
                    <h3 className="title is-5 mb-2">Monthly Subscription</h3>
                    <ul>
                      <li>Unlimited Flashcards (9GB++)</li>
                      <li>PDF support using Vertex AI</li>
                      <li>Priority Support</li>
                    </ul>
                  </div>
                </div>
                <div className="level-right">
                  <a
                    href={getPaymentPortalLink()}
                    className="button is-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage Subscription
                  </a>
                </div>
              </div>
            </div>
          )}
          {locals?.patreon && !locals?.subscriber && (
            <div className="box">
              <h3 className="title is-5 mb-2">Lifetime Access</h3>
              <p className="subtitle is-6 mb-3">Valid forever</p>
              <ul>
                <li>Unlimited Flashcards (9GB++)</li>
                <li>PDF support using Vertex AI</li>
                <li>Priority Support</li>
                <li>All Future Updates</li>
              </ul>
            </div>
          )}
          {!locals?.subscriber && !locals?.patreon && (
            <div className="box">
              <div className="level">
                <div className="level-left">
                  <div>
                    <h3 className="title is-5 mb-2">Free Plan</h3>
                    <ul>
                      <li>100 flashcards per upload</li>
                      <li>Max upload size: 100mb</li>
                      <li>Community Support</li>
                    </ul>
                  </div>
                </div>
                <div className="level-right">
                  <a href="/pricing" className="button is-primary">
                    Upgrade Now
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Unified Management Section */}
          {(locals?.subscriber || data?.user) && (
            <div className="box mt-5">
              <h3 className="title is-5">Subscription & Account Management</h3>
              <div className="content">
                <p>
                  You can manage or cancel your subscription through Stripe’s
                  customer portal:
                </p>
                <ol>
                  <li>
                    <a
                      href="https://billing.stripe.com/p/login/aEUaHp8ma4VPfPW9AA"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Access Stripe Portal Directly
                    </a>
                  </li>
                </ol>
                <p className="mt-4">
                  <strong>Important:</strong> Use the email address you used
                  when subscribing—it may differ from your 2anki.net account
                  email.
                </p>
                <p className="mt-4">
                  <strong>Having trouble?</strong>
                </p>
                <ul>
                  <li>Check your spam folder for login emails</li>
                  <li>
                    Email us at{' '}
                    <a href="mailto:support@2anki.net">support@2anki.net</a>
                  </li>
                </ul>

                {locals?.subscriber && (
                  <div className="mt-5">
                    <h4 className="title is-6">Linked 2anki.net Email</h4>
                    {locals.subscriptionInfo?.linked_email === user.email ? (
                      <p>
                        Your subscription is managed through your Stripe account
                        at <strong>{locals.subscriptionInfo?.email}</strong>.
                        You can:
                        <ul>
                          <li>Manage your subscription</li>
                          <li>Update payment details</li>
                          <li>Cancel your subscription</li>
                        </ul>
                      </p>
                    ) : (
                      <div>
                        <div
                          className={`control ${isLinking ? 'is-loading' : ''}`}
                        >
                          <input
                            value={linkEmail}
                            onChange={onChangeLinkEmail}
                            id="email"
                            className={`input ${linkError ? 'is-danger' : ''} ${
                              linkSuccess ? 'is-success' : ''
                            }`}
                            type="email"
                            placeholder="Enter subscription email"
                            disabled={
                              locals.subscriptionInfo?.linked_email ===
                              user.email
                            }
                          />
                        </div>
                        {linkError && (
                          <p className="help is-danger">{linkError}</p>
                        )}
                        {linkSuccess && (
                          <p className="help is-success">
                            Email linked successfully!
                          </p>
                        )}
                        <p className="py-4">
                          <button
                            type="button"
                            className="button is-link"
                            onClick={onLink}
                            disabled={
                              locals.subscriptionInfo?.linked_email ===
                              user.email
                            }
                          >
                            Link Email
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Account Deletion */}
                <div className="mt-5">
                  <p className="has-text-danger">
                    Deleting your account will permanently remove all your data
                    and cannot be undone.
                  </p>
                  <a
                    href="/delete-account"
                    className="button is-danger is-small"
                  >
                    Delete Account
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
