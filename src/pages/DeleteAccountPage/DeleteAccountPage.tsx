import React from 'react';

import Cookies from 'universal-cookie';
import { redirectToFrontPage } from '../../lib/redirects';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import styles from '../AccountPage/AccountPage.module.css';
import sharedStyles from '../../styles/shared.module.css';

interface Prop {
  setError: ErrorHandlerType;
}

export function DeleteAccountPage({ setError }: Prop) {
  const [count, setCount] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const deleteButtonText = count === 0 ? 'Delete' : 'I am sure!';

  const handleDelete = async () => {
    if (count < 1) {
      setCount(count + 1);
      return;
    }

    setIsDeleting(true);
    try {
      await get2ankiApi().deleteAccount(count === 2);
      localStorage.clear();
      sessionStorage.clear();
      new Cookies().remove('token');
      redirectToFrontPage();
    } catch (error) {
      setError(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.mainCard}>
        <h1 className={sharedStyles.sectionTitle}>Delete Account</h1>
        <p className={sharedStyles.smallDescription}>
          Are you sure you want to delete your account?
        </p>
        <p
          className={`${sharedStyles.smallDescription} ${sharedStyles.marginBottomLg}`}
        >
          This action is irreversible and will also cancel any active
          subscriptions.
        </p>

        {isDeleting && (
          <div className={sharedStyles.infoBox}>
            Deleting your account and cancelling subscriptions...
          </div>
        )}

        <button
          onClick={handleDelete}
          className={styles.dangerButton}
          type="button"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : deleteButtonText}
        </button>
        <p
          className={`${sharedStyles.smallDescription} ${sharedStyles.marginTopLg} ${sharedStyles.wordBreak}`}
        >
          Also disconnect it from Notion:{' '}
          <a
            href="https://www.notion.so/help/add-and-manage-integrations-with-the-api"
            target="_blank"
            rel="noreferrer"
          >
            https://www.notion.so/help/add-and-manage-integrations-with-the-api
          </a>
        </p>
      </div>
    </div>
  );
}
