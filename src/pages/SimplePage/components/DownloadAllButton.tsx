interface Props {
  onClickDownloadAll: () => void;
  disabled?: boolean;
}

const styles: React.CSSProperties = {
  padding: '0.4rem',
  borderRadius: '100px',
  width: '100%',
  border: 'none',
  fontWeight: 'bold',
};

function DownloadAllButton({ disabled, onClickDownloadAll }: Readonly<Props>) {
  return (
    <div>
      <button
        disabled={disabled}
        type="button"
        style={styles}
        onClick={onClickDownloadAll}
      >
        Download all
      </button>
    </div>
  );
}

export default DownloadAllButton;
