import { useEffect, useState } from 'react';
import { useSpeechSynthesis } from '../../helpers/useSpeechSynthesis';
import { DeleteIcon } from './icons/DeleteIcon';
import { ScissorsIcon } from './icons/ScissorsIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';

interface BlockControlsProps {
  total: number;
  index: number;
  loading: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onDelete: () => void;
  onExtract: () => void;
  onCreateNote: () => void;
}

export function BlockControls(props: BlockControlsProps) {
  const [metaPressed, setMeta] = useState(false);
  const speak = useSpeechSynthesis();
  const { loading, total, index, setIndex, onDelete, onExtract, onCreateNote } =
    props;

  const goToNextBlock = () => setIndex(Math.min(index + 1, total - 1));
  const gotToPreviousBlock = () => setIndex(Math.max(index - 1, 0));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'ArrowLeft') {
        gotToPreviousBlock();
      } else if (key === 'ArrowRight') {
        goToNextBlock();
      } else if (key === 'Backspace' || key === 'Delete') {
        onDelete();
      } else if (key === 'Meta' || key === 'Alt') {
        setMeta(true);
      } else if (key === 'x' && metaPressed) {
        onExtract();
        setMeta(false);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Meta') {
        setMeta(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  return (
    <div className="field has-addons">
      <p className="control">
        <button
          aria-label="previous block"
          className="button is-small"
          type="button"
          onClick={() => gotToPreviousBlock()}
        >
          ←
        </button>
      </p>
      {loading && (
        <p className="control">
          <button type="button" className="is-small is-loading button">
            loading
          </button>
        </p>
      )}
      {!loading && (
        <p className="control">
          <button
            aria-label="current block"
            type="button"
            className="button is-small"
          >
            {index + 1} /{total}
          </button>
        </p>
      )}
      <p className="control">
        <button
          aria-label="Next block"
          className="button is-small"
          type="button"
          onClick={() => goToNextBlock()}
        >
          →
        </button>
      </p>
      <p className="control">
        <button
          aria-label="delete"
          className="button is-small"
          type="button"
          onClick={() => {
            onDelete();
          }}
        >
          <span className="icon is-small">
            <DeleteIcon />
          </span>
        </button>
      </p>
      <p className="control">
        <a className="button is-small" href="/search">
          <span className="icon is-small">
            <SearchIcon />
          </span>
        </a>
      </p>
      <p className="control">
        <button
          aria-label="speak"
          className="button is-small"
          type="button"
          onClick={() => speak()}
        >
          <span className="icon is-small">
            <SpeakerWaveIcon />
          </span>
        </button>
      </p>
      <p className="control">
        <button
          aria-label="extract"
          className="button is-small"
          type="button"
          onClick={() => onExtract()}
        >
          <span className="icon is-small">
            <ScissorsIcon />
          </span>
        </button>
      </p>
      <p className="control">
        <button
          aria-label="create note"
          className="button is-small"
          type="button"
          onClick={() => onCreateNote()}
        >
          <span className="icon is-small">
            <img alt="create flashcard" src="/icons/Anki_app_logo.png" />
          </span>
        </button>
      </p>
    </div>
  );
}
