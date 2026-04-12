import styles from '../styles/shared.module.css';

interface FontPickerDelegate {
  fontSize: string;
  pickedFontSize: (fs: string) => void;
}

function FontSizePicker(delegate: FontPickerDelegate) {
  const { fontSize, pickedFontSize } = delegate;

  return (
    <div>
      <div>
        <div className={`${styles.flexColumn} ${styles.flexCenter}`}>
          <label htmlFor="font-size" className="label">
            Font Size
            <input
              id="font-size"
              name="font-size"
              type="range"
              min="10"
              max="100"
              value={fontSize}
              onChange={(event) => pickedFontSize(event.target.value)}
            />
          </label>
          <span style={{ fontSize: `${fontSize}px` }}>{fontSize}</span>
        </div>
      </div>
    </div>
  );
}

export default FontSizePicker;
