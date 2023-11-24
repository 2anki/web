import { useContext, useEffect, useState } from 'react';

import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { Main, PageContainer } from '../../components/styled';
import StoreContext from '../../store/StoreContext';
import SimpleUploadForm, {
  CreatedDeck,
} from './components/UploadForm/SimpleUploadForm';
import { InfoMessage, UploadContainer } from './styled';

export function SimplePage() {
  const store = useContext(StoreContext);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [createdDecks, setCreatedDecks] = useState<CreatedDeck[]>([]);

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
            <SimpleUploadForm
              onDecksCreated={(decks: CreatedDeck[]) => setCreatedDecks(decks)}
              setErrorMessage={(error) => setErrorMessage(error as Error)}
            />
            <ul>
              {createdDecks.map((deck) => (
                <li key={deck.link}>
                  <a href={`${deck.link}`}>{deck.name}</a>
                </li>
              ))}
            </ul>
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
