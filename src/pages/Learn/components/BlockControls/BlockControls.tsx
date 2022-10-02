import { useEffect } from 'react';

interface BlockControlsProps {
  total: number;
  index: number;
  loading: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function BlockControls(props: BlockControlsProps) {
  const { loading, total, index, setIndex } = props;

  const goToNextBlock = () => setIndex(Math.min(index + 1, total - 1));
  const gotToPreviousBlock = () => setIndex(Math.max(index - 1, 0));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'ArrowLeft') {
        gotToPreviousBlock();
      } else if (key === 'ArrowRight') {
        goToNextBlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
    </div>
  );
}
