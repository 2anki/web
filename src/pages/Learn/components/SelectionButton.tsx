import { ReactNode } from "react";

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
  const isLoading = loading ? "is-loading" : "";
  return (
    <p className="control is-clickable">
      <button
        disabled={disabled}
        aria-label={label}
        className={`button is-small ${isLoading}`}
        type="button"
        onClick={onClick}
      >
        <span className="icon is-small">{icon}</span>
      </button>
    </p>
  );
}
