import { ReactNode } from 'react';

interface SelectionButtonProps {
  label: ReactNode;
  onClick: () => void;
  icon: ReactNode;
  loading: boolean;
  disabled: boolean;
}

export function SelectionButton({
  loading,
  label,
  onClick,
  icon,
  disabled
}: SelectionButtonProps) {
  return (
    <p className="control">
      <button
        disabled={disabled}
        // aria-label={label}
        className={`button is-small ${loading ? 'is-loading' : ''}`}
        type="button"
        onClick={onClick}
      >
        <span className="icon is-small">{icon}</span>
        {label}
      </button>
    </p>
  );
}
