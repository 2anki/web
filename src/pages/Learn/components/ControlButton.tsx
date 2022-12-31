import { ReactNode } from "react";
import styled from "styled-components";

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  loading: boolean;
  disabled?: boolean;
}

const Paragraph = styled.p`
  * {
    user-select: none;
  }
`;

export function ControlButton({
  loading,
  label,
  onClick,
  icon,
  disabled
}: ControlButtonProps) {
  return (
    <Paragraph className="control">
      <button
        disabled={disabled}
        aria-label={label}
        className={`button is-small ${loading ? "is-loading" : ""}`}
        type="button"
        onClick={onClick}
      >
        <span className="icon is-small">{icon}</span>
      </button>
    </Paragraph>
  );
}

ControlButton.defaultProps = {
  disabled: false
};
