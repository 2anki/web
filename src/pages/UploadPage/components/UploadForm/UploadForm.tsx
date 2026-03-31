import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ErrorHandlerType } from '../../../../components/errors/helpers/getErrorMessage';
import handleRedirect from '../../../../lib/handleRedirect';
import getAcceptedContentTypes from '../../helpers/getAcceptedContentTypes';
import getHeadersFilename from '../../helpers/getHeadersFilename';
import DownloadButton from '../DownloadButton';
import DropParagraph from '../DropParagraph';
import { useDrag } from './hooks/useDrag';

const CLAUDE_STAGES = [
  { label: 'Preparing document…', cumulative: 0 },
  { label: 'Sending to Claude AI…', cumulative: 800 },
  { label: 'Claude is generating flashcards…', cumulative: 2000 },
  { label: 'Building your Anki deck…', cumulative: 12000 },
  { label: 'Almost ready…', cumulative: 14500 },
];

interface ClaudeProgressProps {
  stage: number;
}

function ClaudeProgress({ stage }: Readonly<ClaudeProgressProps>) {
  const label = CLAUDE_STAGES[Math.min(stage, CLAUDE_STAGES.length - 1)].label;
  const progressValue = Math.min(95, (stage / (CLAUDE_STAGES.length - 1)) * 95);

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <p style={{ marginBottom: '0.5rem', color: '#7c3aed', fontWeight: 500 }}>
        ✨ {label}
      </p>
      <progress
        className="progress is-small"
        value={progressValue}
        max={100}
        style={{ accentColor: '#7c3aed' }}
      />
    </div>
  );
}

interface UploadFormProps {
  setErrorMessage: ErrorHandlerType;
}

function UploadForm({ setErrorMessage }: Readonly<UploadFormProps>) {
  const [uploading, setUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<null | string>('');
  const [deckName, setDeckName] = useState('');
  const [claudeStage, setClaudeStage] = useState(0);
  const claudeEnabled = localStorage.getItem('claude-ai-flashcards') === 'true';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convertRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!uploading || !claudeEnabled) {
      setClaudeStage(0);
      return;
    }
    const timers = CLAUDE_STAGES.slice(1).map(({ cumulative }, i) =>
      setTimeout(() => setClaudeStage(i + 1), cumulative)
    );
    return () => timers.forEach(clearTimeout);
  }, [uploading, claudeEnabled]);
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
          {uploading && claudeEnabled && <ClaudeProgress stage={claudeStage} />}
          <button
            aria-label="Upload file"
            style={{ visibility: 'hidden' }}
            ref={convertRef}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}

export default UploadForm;
