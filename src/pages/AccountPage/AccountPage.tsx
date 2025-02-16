import React, { useState, ChangeEvent } from 'react';
import { useMutation } from 'react-query';
import { useUserLocals } from '../../lib/hooks/useUserLocals';
import { PageContainer } from '../../components/styled';
import LoadingIndicator from '../../components/Loading';
import { postLinkEmail } from '../../lib/backend/postLinkEmail';

export default function AccountPage() {
  const { isLoading, data } = useUserLocals();
  const [linkEmail, setLinkEmail] = useState<string>(data?.linked_email ?? '');
  const { mutate: linkEmailMutate, isLoading: isLinking } = useMutation({
    mutationFn: (email: string) => postLinkEmail(email),
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!data?.user) {
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
        {/* Profile Section */}
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
              />
            </figure>
          </div>
          <div className="column">
            <div className="level is-mobile">
              <div className="level-left">
                <div>
                  <h1 className="title mb-2">{user.name}</h1>
                  <p className="subtitle is-6 mb-2">{user.email}</p>
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

        <div className="content mt-5">
          {/* Subscription Section */}
          <h2 className="title is-4">Plan Details</h2>
          {locals?.subscriber && (
            <div className="box">
              <div className="level">
                <div className="level-left">
                  <div>
                    <h3 className="title is-5 mb-2">Monthly Subscription</h3>
                    <div className="content">
                      <ul>
                        <li>Unlimited Flashcards (9GB++)</li>
                        <li>PDF support using Vertex AI</li>
                        <li>Priority Support</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  <div className="buttons">
                    <a
                      href="https://billing.stripe.com/p/login/aEUaHp8ma4VPfPW9AA"
                      className="button is-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Manage Subscription
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {locals?.patreon && !locals?.subscriber && (
            <div className="box">
              <div className="level">
                <div className="level-left">
                  <div>
                    <h3 className="title is-5 mb-2">Lifetime Access</h3>
                    <p className="subtitle is-6 mb-3">Valid forever</p>
                    <div className="content">
                      <ul>
                        <li>Unlimited Flashcards (9GB++)</li>
                        <li>PDF support using Vertex AI</li>
                        <li>Priority Support</li>
                        <li>All Future Updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!locals?.subscriber && !locals?.patreon && (
            <div className="box">
              <div className="level">
                <div className="level-left">
                  <div>
                    <h3 className="title is-5 mb-2">Free Plan</h3>
                    <div className="content">
                      <ul>
                        <li>100 flashcards per upload</li>
                        <li>Max upload size: 100mb</li>
                        <li>Community Support</li>
                      </ul>
                    </div>
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

          {/* Subscription Management */}
          {locals?.subscriber && (
            <div className="box mt-5">
              <h3 className="title is-5">Managing Your Subscription</h3>
              <div className="content">
                <p>
                  You can manage or cancel your subscription through
                  Stripe&apos;s customer portal:
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
                  <strong>Important:</strong> Make sure to use the email address
                  you used when subscribing, which might be different from your
                  2anki.net account email.
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
              </div>
            </div>
          )}

          {/* Account Management */}
          {data?.user && (
            <div className="box mt-5">
              <h3 className="title is-5">Account Management</h3>

              {/* Link Email Section */}
              {locals?.subscriber && (
                <div className="content mb-5">
                  <h4 className="title is-6">Link Subscription Email</h4>
                  <p>
                    If you used a different email address when subscribing to
                    2anki.net, link it here to manage your subscription:
                  </p>
                  <div className={`control ${isLinking ? 'is-loading' : ''}`}>
                    <input
                      value={linkEmail}
                      onChange={onChangeLinkEmail}
                      id="email"
                      className="input"
                      type="email"
                      placeholder="Enter subscription email"
                    />
                  </div>
                  <p className="py-4">
                    <button
                      type="button"
                      className="button is-link"
                      onClick={onLink}
                    >
                      Link Email
                    </button>
                  </p>
                </div>
              )}

              <div className="content">
                <p className="has-text-danger">
                  Deleting your account will permanently remove all your data
                  and cannot be undone.
                </p>
                <a href="/delete-account" className="button is-danger">
                  Delete Account
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
