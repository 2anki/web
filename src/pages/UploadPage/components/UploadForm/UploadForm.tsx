import { SyntheticEvent, useRef, useState } from 'react';
import { ErrorHandlerType } from '../../../../components/errors/helpers/getErrorMessage';
import handleRedirect from '../../../../lib/handleRedirect';
import getAcceptedContentTypes from '../../helpers/getAcceptedContentTypes';
import getHeadersFilename from '../../helpers/getHeadersFilename';
import DownloadButton from '../DownloadButton';
import { useDrag } from './hooks/useDrag';
import formStyles from './UploadForm.module.css';
import styles from '../../../../styles/shared.module.css';

interface UploadFormProps {
  setErrorMessage: ErrorHandlerType;
}

function UploadForm({ setErrorMessage }: Readonly<UploadFormProps>) {
  const [uploading, setUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<null | string>('');
  const [deckName, setDeckName] = useState('');
  const [cardCount, setCardCount] = useState<number | null>(null);
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
      if (request.status === 202) {
        setUploading(false);
        globalThis.location.href = '/uploads';
        return true;
      }
      if (request.status !== 200) {
        const fallback =
          'The server rejected the upload. Please try again or contact support@2anki.net.';
        let message = fallback;
        try {
          const body = await request.clone().json();
          if (typeof body?.message === 'string' && body.message.trim().length > 0) {
            message = body.message;
          }
        } catch {
          const text = await request.text().catch(() => '');
          if (text && text.length > 0 && text.length < 500 && !text.startsWith('<')) {
            message = text;
          }
        }
        setDownloadLink(null);
        return setErrorMessage(new Error(message));
      }
      const fileNameHeader = getHeadersFilename(request.headers);
      const fallback =
        contentType === 'application/zip' ? 'Your Decks.zip' : 'Your deck.apkg';
      setDeckName(fileNameHeader ?? fallback);
      const cardCountHeader = request.headers.get('X-Card-Count');
      const parsedCardCount = cardCountHeader
        ? Number.parseInt(cardCountHeader, 10)
        : null;
      setCardCount(
        Number.isFinite(parsedCardCount) ? parsedCardCount : null
      );
      const blob = await request.blob();
      setDownloadLink(window.URL.createObjectURL(blob));
      setUploading(false);
    } catch (error) {
      setDownloadLink(null);
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error && /fetch|network/i.test(error.message));
      const friendly = isNetworkError
        ? new Error(
            "We couldn't upload your file. Please check your connection and try again."
          )
        : (error as Error);
      setErrorMessage(friendly);
      setUploading(false);
      return false;
    }
    return true;
  };

  return (
    <form encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
      <label
        htmlFor="pakker"
        className={`${formStyles.dropZone} ${
          dropHover ? formStyles.dropZoneActive : ''
        }`}
      >
        <span className={formStyles.dropIcon}>📄</span>
        <span className={formStyles.dropText}>
          Drag and drop your files here
        </span>
        <span className={formStyles.dropHint}>or</span>
        <span className={formStyles.convertButton}>
          Click to convert your notes
        </span>
        <input
          ref={fileInputRef}
          className={formStyles.fileInput}
          id="pakker"
          type="file"
          name="pakker"
          accept={getAcceptedContentTypes()}
          required
          multiple
          onChange={() => convertRef.current?.click()}
        />
      </label>
      <DownloadButton
        downloadLink={downloadLink}
        deckName={deckName}
        uploading={uploading}
        cardCount={cardCount}
      />
      <button
        aria-label="Upload file"
        className={styles.hidden}
        ref={convertRef}
        type="submit"
      />
    </form>
  );
}

export default UploadForm;
