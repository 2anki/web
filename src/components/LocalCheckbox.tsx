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
    <label htmlFor={label} className="checkbox">
      <input
        name={label}
        className="mr-2"
        type="checkbox"
        checked={isChecked}
        onChange={(event) => {
          onChecked(event.target.checked);
          setChecked(event.target.checked);
        }}
      />
      <strong>{label}</strong>
      {description && <p className="is-size-7 py-1 px-5 mb-2">{description}</p>}
    </label>
  );
}

export default LocalCheckbox;
