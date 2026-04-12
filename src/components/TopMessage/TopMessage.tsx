import useQuery from '../../lib/hooks/useQuery';
import styles from '../../styles/shared.module.css';

function TopMessage() {
  const query = useQuery();
  const errorMessage = query.get('error');

  if (errorMessage === 'upload_limit_exceeded') {
    return (
      <div className={styles.alertDanger}>
        <p>You have reached the upload limit of 100 flashcards.</p>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className={styles.alertDanger}>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return null;
}

export default TopMessage;
