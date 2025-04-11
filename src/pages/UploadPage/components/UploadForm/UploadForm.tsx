import { SyntheticEvent, useRef, useState } from 'react';
import { ErrorHandlerType } from '../../../../components/errors/helpers/getErrorMessage';
import handleRedirect from '../../../../lib/handleRedirect';
import getAcceptedContentTypes from '../../helpers/getAcceptedContentTypes';
import getHeadersFilename from '../../helpers/getHeadersFilename';
import DownloadButton from '../DownloadButton';
import DropParagraph from '../DropParagraph';
import { useDrag } from './hooks/useDrag';
import SubscriptionModal from '../../../../components/modals/SubscriptionModal';

interface UploadFormProps {
  setErrorMessage: ErrorHandlerType;
  isLoggedIn: boolean;
}

function UploadForm({ setErrorMessage, isLoggedIn }: Readonly<UploadFormProps>) {
  const [uploading, setUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<null | string>('');
  const [deckName, setDeckName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convertRef = useRef<HTMLButtonElement>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ type: 'cards' | 'size', current: number, limit: number }>({ type: 'cards', current: 0, limit: 100 });
  const { dropHover } = useDrag({
    onDrop: (event) => {
      const { dataTransfer } = event;

      if (dataTransfer && dataTransfer.files.length > 0) {
        fileInputRef.current!.files = dataTransfer.files;
        convertRef.current?.click();
      }

      event.preventDefault();
    }
  });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setUploading(true);
    try {
      // Check file size limits for free tier
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const totalSize = Array.from(fileInput.files).reduce((sum, file) => sum + file.size, 0);
        const FREE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
        
        // Estimate number of cards based on file size (rough estimate)
        // Assuming average of 1KB per card
        const estimatedCards = Math.round(totalSize / 1024);
        const FREE_CARD_LIMIT = 100; // 100 cards
        
        // Check if user exceeds free limits and is not logged in or not a subscriber
        if (!isLoggedIn && (estimatedCards > FREE_CARD_LIMIT || totalSize > FREE_SIZE_LIMIT)) {
          if (estimatedCards > FREE_CARD_LIMIT) {
            setLimitInfo({ type: 'cards', current: estimatedCards, limit: FREE_CARD_LIMIT });
          } else {
            setLimitInfo({ type: 'size', current: totalSize, limit: FREE_SIZE_LIMIT });
          }
          setShowSubscriptionModal(true);
          setUploading(false);
          return false;
        }
      }
      
      const storedFields = Object.entries(window.localStorage);
      const element = event.currentTarget as HTMLFormElement;
      const formData = new FormData(element);
      storedFields.forEach((sf) => formData.append(sf[0], sf[1]));
      const request = await window.fetch('/api/upload/file', {
        method: 'post',
        body: formData
      });
      const contentType = request.headers.get('Content-Type');
      const notOK = request.status !== 200;
      if (request.redirected) {
        return handleRedirect(request);
      }

      if (notOK) {
        const text = await request.text();
        setDownloadLink(null);
        return setErrorMessage(text);
      }
      const fileNameHeader = getHeadersFilename(request.headers);
      if (fileNameHeader) {
        setDeckName(fileNameHeader);
      } else {
        const fallback =
          contentType === 'application/zip'
            ? 'Your Decks.zip'
            : 'Your deck.apkg';
        setDeckName(fallback);
      }
      const blob = await request.blob();
      setDownloadLink(window.URL.createObjectURL(blob));
      setUploading(false);
    } catch (error) {
      setDownloadLink(null);
      setErrorMessage(error as Error);
      setUploading(false);
      return false;
    }
    return true;
  };

  const fileSelected = () => {
    convertRef.current?.click();
  };

  return (
    <>
      <SubscriptionModal
        isActive={showSubscriptionModal}
        onClickClose={() => setShowSubscriptionModal(false)}
        isLoggedIn={isLoggedIn}
        limitType={limitInfo.type}
        currentValue={limitInfo.current}
        limitValue={limitInfo.limit}
      />
      <form
        encType="multipart/form-data"
        method="post"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
      <div className="container">
        <div>
          <div className="field">
            <DropParagraph hover={dropHover}>
              Drag a file and Drop it here
              <p className="my-2">
                <i>or</i>
              </p>
              <label htmlFor="pakker">
                <input
                  ref={fileInputRef}
                  className="file-input"
                  type="file"
                  name="pakker"
                  accept={getAcceptedContentTypes()}
                  required
                  multiple
                  onChange={() => fileSelected()}
                />
              </label>
              <span className="tag is-large is-link">Click to convert your notes</span>
            </DropParagraph>
          </div>
          <DownloadButton
            downloadLink={downloadLink}
            deckName={deckName}
            uploading={uploading}
          />
          <button
            aria-label="Upload file"
            style={{ visibility: 'hidden' }}
            ref={convertRef}
            type="submit"
          />
        </div>
      </div>
    </form>
    </>
  );
}

export default UploadForm;
