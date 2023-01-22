import React from 'react';

import Cookies from 'universal-cookie';
import { ErrorHandlerType } from '../../components/errors/helpers/types';
import { UploadContainer } from '../Upload/styled';
import { Layout } from '../../components/Layout/styled';
import Backend from '../../lib/backend';
import { redirectToFrontPage } from '../../lib/redirects';

interface Prop {
  setError: ErrorHandlerType;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DeleteAccountPage({ setError }: Prop) {
  const [count, setCount] = React.useState(0);
  const deleteButtonText = count === 0 ? 'Delete' : 'I am sure!';

  const handleDelete = async () => {
    if (count < 1) {
      setCount(count + 1);
      return;
    }

    try {
      const backend = new Backend();
      await backend.deleteAccount(count === 2);
      localStorage.clear();
      sessionStorage.clear();
      new Cookies().remove('token');
      alert('Account deleted! Farewell 👋🏾');
      redirectToFrontPage();
    } catch (e) {
      if (e instanceof Error) {
        setError(e as Error);
      }
    }
  };
  return <Layout>
    <UploadContainer>

      <div className="content">
        <h1>Delete Account</h1>
        <p>
          Are you sure you want to delete your account?
        </p>
        <p>
          This action is irreversible.
        </p>
        <button
          onClick={handleDelete}
          className="button is-small is-danger" type="button">
          {deleteButtonText}
        </button>
      </div>
    </UploadContainer>
  </Layout>;
}