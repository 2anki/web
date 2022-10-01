interface PageControlsProps {
  total: number;
  index: number;
  loading: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function PageControls(props: PageControlsProps) {
  const { loading, total, index, setIndex } = props;

  return (
    <div className="field has-addons">
      <p className="control">
        <button
          aria-label="previous block"
          className="button is-small"
          type="button"
          onClick={() => setIndex(Math.max(index - 1, 0))}
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
          onClick={() => setIndex(Math.min(index + 1, total - 1))}
        >
          →
        </button>
      </p>
    </div>
  );
}
