import React, { useState } from 'react';
import styles from '../styles/shared.module.css';

interface Props {
  label: string;
  defaultValue: boolean;
  description: string | null;
  onChecked: (checked: boolean) => void;
}

function LocalCheckbox({
  label,
  defaultValue,
  description = null,
  onChecked,
}: Props) {
  const [isChecked, setChecked] = useState(defaultValue);

  return (
    <label htmlFor={label} className={styles.checkbox}>
      <input
        name={label}
        type="checkbox"
        checked={isChecked}
        onChange={(event) => {
          onChecked(event.target.checked);
          setChecked(event.target.checked);
        }}
      />
      <strong>{label}</strong>
      {description && (
        <p className={styles.checkboxDescription}>{description}</p>
      )}
    </label>
  );
}

export default LocalCheckbox;
