import { useState } from 'react';
import { Link } from 'react-router-dom';

import useQuery from '../../lib/hooks/useQuery';
import WarningMessage from '../../components/WarningMessage';
import UploadForm from './components/UploadForm/UploadForm';
import SettingsIcon from '../../components/icons/SettingsIcon';
import SettingsModal from '../../components/modals/SettingsModal/SettingsModal';
import {
  FlexColumn,
  ImportTitle,
  InfoMessage,
  SettingsLink,
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

  const [isSettings, setShowSettings] = useState(
    view === 'template' || view === 'deck-options' || view === 'card-options'
  );

  return (
    <PageContainer>
      <UploadContainer>
        <Main>
          {isDevelopment ? <WarningMessage /> : null}
          <FlexColumn>
            <ImportTitle>{getVisibleText('upload.page.title')}</ImportTitle>
            <SettingsLink onClick={() => setShowSettings(true)}>
              <Link className="link" to="?view=template">
                <SettingsIcon />
                Settings
              </Link>
            </SettingsLink>
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
              isActive={isSettings}
              onClickClose={() => {
                window.history.pushState({}, '', 'upload');
                setShowSettings(false);
              }}
            />
          </div>
        </Main>
      </UploadContainer>
    </PageContainer>
  );
}
