import { useEffect, useState } from 'react';
import { DeleteIcon } from './DeleteIcon';
import { SearchIcon } from './SearchIcon';

interface BlockControlsProps {
  total: number;
  index: number;
  loading: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onDelete: () => void;
  onExtract: () => void;
}

export function BlockControls(props: BlockControlsProps) {
  const [metaPressed, setMeta] = useState(false);
  const { loading, total, index, setIndex, onDelete, onExtract } = props;

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
      } else if (key === 'Meta' || 'Alt') {
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
    </div>
  );
}
