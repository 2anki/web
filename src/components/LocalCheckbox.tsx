import React, { useState } from 'react';

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
                         onChecked
                       }: Props) {
  const [isChecked, setChecked] = useState(defaultValue);

  return (
    <>
      <label htmlFor={label} className="checkbox">
        <input
          name={label}
          style={{ marginRight: '0.2rem' }}
          type="checkbox"
          checked={isChecked}
          onChange={(event) => {
            onChecked(event.target.checked);
            setChecked(event.target.checked);
          }}
        />
        <strong>{label}</strong>
      </label>
      {description && <p className="is-size-7">{description}</p>}
    </>
  );
}

export default LocalCheckbox;
