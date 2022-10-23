import { ReactNode } from 'react';

interface SelectionButtonProps {
  label: string;
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
  const isLoading = loading ? 'is-loading' : '';
  const isActive = label && label.length > 0 ? 'is-link' : '';
  return (
    <p className="control is-clickable">
      <button
        disabled={disabled}
        // aria-label={label}
        className={`button is-small ${isLoading} ${isActive}`}
        type="button"
        onClick={onClick}
      >
        <span className="icon is-small">{icon}</span>
      </button>
    </p>
  );
}
