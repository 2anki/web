import React from 'react';
import styled from 'styled-components';

interface KiModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  isOpen: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: var(--spacing-md);
`;

const ModalContainer = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: var(--spacing-lg);
  color: var(--text-primary);
  line-height: 1.6;

  p {
    margin-bottom: var(--spacing-md);
  }

  ul {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
  }

  li {
    margin-bottom: var(--spacing-xs);
  }

  strong {
    font-weight: 600;
    color: var(--text-primary);
  }
`;

export function KiModal({ title, onClose, children, isOpen }: KiModalProps): React.ReactElement | null {
  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return isOpen ? (
    <ModalOverlay aria-label="Modal background overlay" onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose onClick={onClose}>×</ModalClose>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  ) : null;
}
