import styles from '../AccountPage.module.css';

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
    <div className={styles.profileSection}>
      <img
        className={styles.avatar}
        src={avatarSrc}
        alt={`${user.name}'s avatar`}
        data-hj-suppress
      />
      <div className={styles.profileInfo}>
        <h1 className={styles.profileName} data-hj-suppress>
          {user.name}
        </h1>
        <p className={styles.profileEmail} data-hj-suppress>
          {user.email}
        </p>
        <span className={styles.statusBadge}>{subscriptionStatus}</span>
      </div>
    </div>
  );
}
