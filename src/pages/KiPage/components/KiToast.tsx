import React from 'react';
import styled from 'styled-components';

interface KiToastProps {
  message: string;
  type: string;
}

const ToastContainer = styled.div<{ type: string }>`
  position: fixed;
  bottom: 200px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => {
    switch (props.type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      default: return 'var(--primary)';
    }
  }};
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  animation: toast-in-out 3s ease-in-out;
  pointer-events: none;
  max-width: 80%;
  text-align: center;

  @keyframes toast-in-out {
    0% {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    15% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    85% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
  }
`;

export function KiToast({ message, type }: KiToastProps): React.ReactElement {
  return (
    <ToastContainer type={type}>
      {message}
    </ToastContainer>
  );
};
