import React from 'react';

import Cookies from 'universal-cookie';
import { UploadContainer } from '../UploadPage/styled';
import { Layout } from '../../components/Layout/styled';
import { redirectToFrontPage } from '../../lib/redirects';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';

interface Prop {
  setError: ErrorHandlerType;
}

export function DeleteAccountPage({ setError }: Prop) {
  const [count, setCount] = React.useState(0);
  const deleteButtonText = count === 0 ? 'Delete' : 'I am sure!';

  const handleDelete = async () => {
    if (count < 1) {
      setCount(count + 1);
      return;
    }

    await get2ankiApi().deleteAccount(count === 2).catch(setError);
    localStorage.clear();
    sessionStorage.clear();
    new Cookies().remove('token');
    redirectToFrontPage();
  };
  return (
    <Layout>
      <UploadContainer>
        <div className="content">
          <h1>Delete Account</h1>
          <p>Are you sure you want to delete your account?</p>
          <p>This action is irreversible.</p>
          <button
            onClick={handleDelete}
            className="button is-small is-danger"
            type="button"
          >
            {deleteButtonText}
          </button>
          <p className="is-wrap">
            {' '}
            Also disconnect it from Notion:
            https://www.notion.so/help/add-and-manage-integrations-with-the-api
          </p>
        </div>
      </UploadContainer>
    </Layout>
  );
}
