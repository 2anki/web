import { ReactNode } from 'react';
import styled from 'styled-components';

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  loading: boolean;
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
  icon
}: ControlButtonProps) {
  return (
    <Paragraph className="control">
      <button
        aria-label={label}
        className={`button is-small ${loading ? 'is-loading' : ''}`}
        type="button"
        onClick={onClick}
      >
        <span className="icon is-small">{icon}</span>
      </button>
    </Paragraph>
  );
}
