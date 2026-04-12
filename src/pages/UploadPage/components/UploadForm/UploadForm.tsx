import { SyntheticEvent, useRef, useState } from 'react';
import { ErrorHandlerType } from '../../../../components/errors/helpers/getErrorMessage';
import handleRedirect from '../../../../lib/handleRedirect';
import getAcceptedContentTypes from '../../helpers/getAcceptedContentTypes';
import getHeadersFilename from '../../helpers/getHeadersFilename';
import DownloadButton from '../DownloadButton';
import DropParagraph from '../DropParagraph';
import { useDrag } from './hooks/useDrag';
import { ClaudeProgress } from './ClaudeProgress';
import styles from '../../../../styles/shared.module.css';

interface UploadFormProps {
  setErrorMessage: ErrorHandlerType;
}

function UploadForm({ setErrorMessage }: Readonly<UploadFormProps>) {
  const [uploading, setUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<null | string>('');
  const [deckName, setDeckName] = useState('');
  const claudeEnabled = localStorage.getItem('claude-ai-flashcards') === 'true';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convertRef = useRef<HTMLButtonElement>(null);

  const { dropHover } = useDrag({
    onDrop: (event) => {
      const { dataTransfer } = event;
      if (dataTransfer && dataTransfer.files.length > 0) {
        fileInputRef.current!.files = dataTransfer.files;
        convertRef.current?.click();
      }
      event.preventDefault();
    },
  });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setUploading(true);
    try {
      const storedFields = Object.entries(window.localStorage);
      const element = event.currentTarget as HTMLFormElement;
      const formData = new FormData(element);
      storedFields.forEach((sf) => formData.append(sf[0], sf[1]));
      const request = await window.fetch('/api/upload/file', {
        method: 'post',
        body: formData,
      });
      const contentType = request.headers.get('Content-Type');
      if (request.redirected) {
        return handleRedirect(request);
      }
      if (request.status !== 200) {
        const text = await request.text();
        setDownloadLink(null);
        return setErrorMessage(text);
      }
      const fileNameHeader = getHeadersFilename(request.headers);
      const fallback =
        contentType === 'application/zip' ? 'Your Decks.zip' : 'Your deck.apkg';
      setDeckName(fileNameHeader ?? fallback);
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

  return (
    <form encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
      <div>
        <div>
          <div>
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
                  onChange={() => convertRef.current?.click()}
                />
              </label>
              <span className={styles.btnPrimary}>
                Click to convert your notes
              </span>
            </DropParagraph>
          </div>
          <DownloadButton
            downloadLink={downloadLink}
            deckName={deckName}
            uploading={uploading}
          />
          <ClaudeProgress active={uploading && claudeEnabled} />
          <button
            aria-label="Upload file"
            className={styles.hidden}
            ref={convertRef}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}

export default UploadForm;
