import { useState } from 'react';

import useQuery from '../../lib/hooks/useQuery';
import WarningMessage from '../../components/WarningMessage';
import UploadForm from './components/UploadForm/UploadForm';
import SettingsModal from '../../components/modals/SettingsModal/SettingsModal';
import {
  FlexColumn,
  ImportTitle,
  InfoMessage,
  UploadContainer
} from './styled';
import { Main, PageContainer } from '../../components/styled';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { getVisibleText } from '../../lib/text/getVisibleText';

interface Props {
  setErrorMessage: ErrorHandlerType;
}

export function UploadPage({ setErrorMessage }: Props) {
  const isDevelopment = !window.location.host.match(/2anki.(com|net|de)/);
  const query = useQuery();
  const view = query.get('view');

  const [showCardOptionsModal, setShowCardOptionsModal] = useState(
    view === 'template' || view === 'deck-options' || view === 'card-options'
  );

  return (
    <PageContainer>
      <UploadContainer>
        <Main>
          {isDevelopment ? <WarningMessage /> : null}
          <FlexColumn>
            <ImportTitle>{getVisibleText('upload.page.title')}</ImportTitle>
          </FlexColumn>
          <div className="container">
            <UploadForm setErrorMessage={setErrorMessage} />
            <p>{getVisibleText('upload.page.subtitle')}</p>
            <InfoMessage>
              All files uploaded here are automatically deleted after 21
              minutes.
            </InfoMessage>
            <SettingsModal
              setError={setErrorMessage}
              pageId={null}
              isActive={showCardOptionsModal}
              onClickClose={() => {
                window.history.pushState({}, '', 'upload');
                setShowCardOptionsModal(false);
              }}
            />
          </div>
        </Main>
      </UploadContainer>
    </PageContainer>
  );
}
