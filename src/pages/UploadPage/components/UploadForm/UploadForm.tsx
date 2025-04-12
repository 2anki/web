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

  // Check if upload exceeds free tier limits
  const checkFreeTierLimits = (fileInput: HTMLInputElement | null): boolean => {
    if (!fileInput?.files || fileInput.files.length === 0) return false;
    
    const FREE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
    const FREE_CARD_LIMIT = 100; // 100 cards
    
    const totalSize = Array.from(fileInput.files).reduce(
      (sum, file) => sum + file.size, 0
    );
    
    // Estimate number of cards based on file size (rough estimate - 1KB per card)
    const estimatedCards = Math.round(totalSize / 1024);
    
    // Only show limits for non-logged in users
    if (!isLoggedIn && (estimatedCards > FREE_CARD_LIMIT || totalSize > FREE_SIZE_LIMIT)) {
      // Set the appropriate limit info based on which limit was exceeded
      if (estimatedCards > FREE_CARD_LIMIT) {
        setLimitInfo({ type: 'cards', current: estimatedCards, limit: FREE_CARD_LIMIT });
      } else {
        setLimitInfo({ type: 'size', current: totalSize, limit: FREE_SIZE_LIMIT });
      }
      return true;
    }
    
    return false;
  };
  
  // Process the server response
  const processResponse = async (request: Response): Promise<boolean> => {
    const contentType = request.headers.get('Content-Type');
    
    // Handle redirects
    if (request.redirected) {
      return handleRedirect(request);
    }
    
    // Handle errors
    if (request.status !== 200) {
      const text = await request.text();
      setDownloadLink(null);
      setErrorMessage(text);
      return false;
    }
    
    // Set the deck name
    const fileNameHeader = getHeadersFilename(request.headers);
    if (fileNameHeader) {
      setDeckName(fileNameHeader);
    } else {
      const fallback = contentType === 'application/zip' 
        ? 'Your Decks.zip' 
        : 'Your deck.apkg';
      setDeckName(fallback);
    }
    
    // Create download link
    const blob = await request.blob();
    setDownloadLink(window.URL.createObjectURL(blob));
    return true;
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setUploading(true);
    
    try {
      // Check free tier limits
      const fileInput = fileInputRef.current;
      if (checkFreeTierLimits(fileInput)) {
        setShowSubscriptionModal(true);
        setUploading(false);
        return false;
      }
      
      // Prepare and send form data
      const storedFields = Object.entries(window.localStorage);
      const element = event.currentTarget as HTMLFormElement;
      const formData = new FormData(element);
      storedFields.forEach((sf) => formData.append(sf[0], sf[1]));
      
      const request = await window.fetch('/api/upload/file', {
        method: 'post',
        body: formData
      });
      
      // Process the response
      const success = await processResponse(request);
      setUploading(false);
      return success;
    } catch (error) {
      setDownloadLink(null);
      setErrorMessage(error as Error);
      setUploading(false);
      return false;
    }
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
