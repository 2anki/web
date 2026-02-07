import React from 'react';

interface User {
  name: string;
  email: string;
  picture?: string | null;
}

interface UserProfileProps {
  readonly user: User;
  readonly subscriptionStatus: string;
}

export function UserProfile({ user, subscriptionStatus }: UserProfileProps) {
  const avatarSrc =
    user.picture ?? `https://www.gravatar.com/avatar/${user.email}?s=128&d=mp`;

  return (
    <div className="columns">
      <div className="column is-one-quarter">
        <figure className="image is-128x128 mb-4">
          <img
            className="is-rounded"
            src={avatarSrc}
            alt={`${user.name}'s avatar`}
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
  );
}
