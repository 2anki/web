import { useContext, useEffect, useState } from 'react';

import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { Main, PageContainer } from '../../components/styled';
import StoreContext from '../../store/StoreContext';
import UploadForm from './components/UploadForm/UploadForm';
import {
  InfoMessage,
  UploadContainer
} from './styled';

export function SimplePage() {
  const store = useContext(StoreContext);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);

  // Make sure the defaults are set if not present to ensure backwards compatability
  useEffect(() => {
    store.syncLocalStorage();
  }, [store]);

  if (errorMessage) {
    return <ErrorPresenter error={errorMessage} />;
  }

  return (
    <PageContainer>
      <UploadContainer>
        <Main>
          <div className="container">
            <UploadForm
              setErrorMessage={(error) => setErrorMessage(error as Error)}
            />
            <InfoMessage>
              All files uploaded here are automatically deleted after 21
              minutes.
            </InfoMessage>
          </div>
        </Main>
      </UploadContainer>
    </PageContainer>
  );
}
