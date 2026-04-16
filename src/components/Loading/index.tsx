import shared from '../../styles/shared.module.css';
import styles from './Loading.module.css';

export default function LoadingIndicator() {
  return (
    <div className={styles.loader}>
      <div aria-label="loading" className={shared.spinner} />
    </div>
  );
}
