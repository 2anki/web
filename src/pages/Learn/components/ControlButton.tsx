import { ReactNode } from 'react';

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  loading: boolean;
}

export function ControlButton({
  loading,
  label,
  onClick,
  icon
}: ControlButtonProps) {
  return (
    <p className="control">
      <button
        aria-label={label}
        className={`button is-small ${loading ? 'is-loading' : ''}`}
        type="button"
        onClick={onClick}
      >
        <span className="icon is-small">{icon}</span>
      </button>
    </p>
  );
}
