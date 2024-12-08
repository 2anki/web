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
  CardOptionsLink,
  UploadContainer,
} from './styled';
import { Main, PageContainer } from '../../components/styled';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { getVisibleText } from '../../lib/text/getVisibleText';
import getAcceptedContentTypes from './helpers/getAcceptedContentTypes';

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

  const readableSupportedFiles = getAcceptedContentTypes()
    .split(',')
    .map((type, index, array) => {
      if (index === array.length - 1) return `and ${type}`;
      return type;
    })
    .join(', ');

  return (
    <PageContainer>
      <UploadContainer>
        <Main>
          {isDevelopment ? <WarningMessage /> : null}
          <FlexColumn>
            <ImportTitle>{getVisibleText('upload.page.title')}</ImportTitle>
            <CardOptionsLink onClick={() => setShowCardOptionsModal(true)}>
              <Link className="link" to="?view=template">
                <SettingsIcon />
                {getVisibleText('card.options')}
              </Link>
            </CardOptionsLink>
          </FlexColumn>
          <div className="container">
            <UploadForm setErrorMessage={setErrorMessage} />
            <p>The following files are supported: {readableSupportedFiles}</p>

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
