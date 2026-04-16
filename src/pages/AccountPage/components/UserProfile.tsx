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
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileInfo}>
        <p className={styles.profileName} data-hj-suppress>
          {user.name}
        </p>
        <p className={styles.profileEmail} data-hj-suppress>
          {user.email}
        </p>
        <span className={styles.statusBadge}>{subscriptionStatus}</span>
      </div>
    </div>
  );
}
