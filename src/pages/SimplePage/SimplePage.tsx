import { useContext, useEffect, useState } from 'react';

import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { Main } from '../../components/styled';
import StoreContext from '../../store/StoreContext';
import { CreatedDecksList } from './components/CreatedDecksList';
import DownloadAllButton from './components/DownloadAllButton';
import SimpleUploadForm, { CreatedDeck } from './components/SimpleUploadForm';
import { InfoMessage, UploadContainer } from './styled';

export function SimplePage() {
  const store = useContext(StoreContext);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [createdDecks, setCreatedDecks] = useState<CreatedDeck[]>([]);

  const onClickDownloadAll = () => {
    alert('to be implemented');
  };

  // Make sure the defaults are set if not present to ensure backwards compatability
  useEffect(() => {
    store.syncLocalStorage();
  }, [store]);

  if (errorMessage) {
    return <ErrorPresenter error={errorMessage} />;
  }

  return (
    <UploadContainer>
      <Main>
        <div className="container">
          <SimpleUploadForm
            onDecksCreated={(decks: CreatedDeck[]) =>
              setCreatedDecks([...createdDecks, ...decks])
            }
            setErrorMessage={(error) => setErrorMessage(error as Error)}
          />
        </div>
        <DownloadAllButton
          disabled={createdDecks.length === 0}
          onClickDownloadAll={onClickDownloadAll}
        />
        <CreatedDecksList decks={createdDecks} />
        <InfoMessage>
          All files uploaded here are automatically deleted after 21 minutes.
        </InfoMessage>
      </Main>
    </UploadContainer>
  );
}
