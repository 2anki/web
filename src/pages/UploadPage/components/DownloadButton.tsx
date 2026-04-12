import { useEffect, useRef } from 'react';
import { getDownloadFileName } from '../../DownloadsPage/helpers/getDownloadFileName';
import formStyles from './UploadForm/UploadForm.module.css';

interface Props {
  downloadLink: string | null | undefined;
  deckName: string | undefined;
  uploading: boolean;
}

function DownloadButton(props: Props) {
  const { downloadLink, deckName, uploading } = props;
  const isDownloadable = downloadLink && deckName;
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const isReady = downloadLink && !uploading;

  useEffect(() => {
    if (isReady) {
      downloadRef.current?.click();
    }
  }, [isReady, downloadRef]);

  if (!isDownloadable && !uploading) {
    return null;
  }

  return (
    <div className={formStyles.downloadWrapper}>
      <button
        type="button"
        className={`${formStyles.downloadButton} ${
          isReady ? formStyles.downloadButtonReady : ''
        }`}
        onClick={(event) => {
          if (!isDownloadable) {
            event?.preventDefault();
          }
          downloadRef.current?.click();
        }}
        disabled={!isDownloadable}
      >
        {uploading ? 'Converting...' : 'Download'}
      </button>
      {downloadLink && (
        <a
          hidden
          target="_blank"
          aria-label="download link"
          href={downloadLink}
          download={getDownloadFileName(deckName ?? 'Untitled')}
          ref={downloadRef}
          rel="noreferrer"
        >
          {downloadLink}
        </a>
      )}
    </div>
  );
}

export default DownloadButton;
