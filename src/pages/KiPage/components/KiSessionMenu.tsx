import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SessionHistory, Session } from '../types';

interface KiSessionMenuProps {
  sessionHistory: SessionHistory | null;
  currentSession: Session | null;
  onLoadSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 60px;
  left: 20px;
  width: min(450px, calc(100vw - 40px));
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

const MenuHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(248, 250, 252, 0.8);
`;

const MenuTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  border-radius: 50%;
  
  &:hover {
    background: var(--hover-bg);
    color: var(--primary);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SessionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 6px;
  }
`;

const SessionItem = styled.div<{ $isActive: boolean }>`
  padding: 16px 24px;
  margin: 6px 16px;
  border-radius: var(--radius-md);
  background: ${props => props.$isActive ? 'var(--primary-light)' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  min-width: 0;
  transition: all var(--transition-normal);
  border: 1px solid ${props => props.$isActive ? 'var(--primary-light)' : 'transparent'};
  box-shadow: ${props => props.$isActive ? '0 2px 8px rgba(66, 99, 235, 0.1)' : 'none'};
  
  &:hover {
    background: ${props => props.$isActive ? 'var(--primary)' : 'var(--hover-bg)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$isActive ? '0 4px 12px rgba(66, 99, 235, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.03)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SessionIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
  
  ${SessionItem}:hover & {
    transform: scale(1.05);
  }
`;

const SessionName = styled.div`
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
  font-size: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  width: 32px;
  height: 32px;
  font-size: 14px;
  opacity: 0.7;
  transition: all var(--transition-normal);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MenuFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  background: rgba(248, 250, 252, 0.8);
`;

const NewSessionButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  letter-spacing: 0.01em;
  box-shadow: 0 2px 8px rgba(66, 99, 235, 0.15);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 99, 235, 0.2);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 4px rgba(66, 99, 235, 0.1);
  }
  
  & > span {
    margin-right: 8px;
  }
`;

export function KiSessionMenu({
  sessionHistory,
  currentSession,
  onLoadSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onClose
}: KiSessionMenuProps): React.ReactElement {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDeleteSession();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };
  
  const handleSessionClick = (sessionId: string) => {
    setConfirmDelete(false);
    onLoadSession(sessionId);
    onClose();
  };
  
  const handleNewSession = () => {
    onNewSession();
    onClose();
  };

  return (
    <MenuContainer $isOpen={isOpen} ref={menuRef}>
      <MenuHeader>
        <MenuTitle>Sessions</MenuTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </MenuHeader>
      
      <SessionList>
        {/* Current session */}
        {currentSession && (
          <SessionItem $isActive>
            <SessionIcon>📝</SessionIcon>
            <SessionName title={currentSession.name || 'Current Session'}>
              {currentSession.name || 'Current Session'}
            </SessionName>
            <ActionButton 
              onClick={handleDeleteClick}
              title={confirmDelete ? 'Confirm delete' : 'Delete session'}
              aria-label={confirmDelete ? 'Confirm delete' : 'Delete session'}
            >
              {confirmDelete ? '✓' : '❌'}
            </ActionButton>
          </SessionItem>
        )}
        
        {/* Session history */}
        {sessionHistory?.sessions.map(session => (
          session.id !== currentSession?.id && (
            <SessionItem 
              key={session.id}
              $isActive={false}
              onClick={() => handleSessionClick(session.id)}
            >
              <SessionIcon>📝</SessionIcon>
              <SessionName title={session.name || `Session ${new Date(session.createdAt).toLocaleString()}`}>
                {session.name || `Session ${new Date(session.createdAt).toLocaleString()}`}
              </SessionName>
            </SessionItem>
          )
        ))}
        
        {(!sessionHistory || sessionHistory.sessions.length === 0) && !currentSession && (
          <SessionItem 
            $isActive={false}
          >
            <SessionIcon>ℹ️</SessionIcon>
            <SessionName title="No saved sessions">
              No saved sessions
            </SessionName>
          </SessionItem>
        )}
      </SessionList>
      
      <MenuFooter>
        <NewSessionButton onClick={handleNewSession}>
          <span>🔁</span> New Session
        </NewSessionButton>
      </MenuFooter>
    </MenuContainer>
  );
}
