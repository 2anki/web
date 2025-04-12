import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SessionHistory, Session } from '../types';
import { KiSessionMenu } from './KiSessionMenu';

interface KiHeaderProps {
  isDebugMode: boolean;
  toggleDebug: () => void;
  sessionHistory: SessionHistory | null;
  currentSession: Session | null;
  onLoadSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: () => void;
}

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-sm);
`;

const HeaderContent = styled.div`
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: -0.02em;
  transition: color var(--transition-normal);
  
  &:hover {
    color: var(--primary);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

// Removed HeaderLink as it's no longer used after removing Upload and Pricing links

const DebugButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'var(--primary)' : 'var(--bg-tertiary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: ${props => props.active ? 'var(--shadow-sm)' : 'none'};

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : 'var(--bg-secondary)'};
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }
`;

const SessionButton = styled.button<{ $isActive: boolean }>`
  background: ${props => props.$isActive ? 'var(--primary-light)' : 'rgba(248, 250, 252, 0.8)'};
  color: ${props => props.$isActive ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$isActive ? 'var(--primary-light)' : 'var(--border-color)'};
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: ${props => props.$isActive ? '0 2px 8px rgba(66, 99, 235, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  max-width: 300px;
  letter-spacing: -0.01em;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  &:hover {
    background: ${props => props.$isActive ? 'var(--primary)' : 'var(--hover-bg)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$isActive ? '0 4px 12px rgba(66, 99, 235, 0.2)' : '0 3px 6px rgba(0, 0, 0, 0.08)'};
    border-color: ${props => props.$isActive ? 'var(--primary)' : 'var(--primary-light)'};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${props => props.$isActive ? '0 1px 4px rgba(66, 99, 235, 0.1)' : 'none'};
  }
  
  & > span {
    font-size: 16px;
  }
  
  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export function KiHeader({
  isDebugMode,
  toggleDebug,
  sessionHistory,
  currentSession,
  onLoadSession,
  onNewSession,
  onDeleteSession
}: KiHeaderProps): React.ReactElement {
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
  
  const toggleSessionMenu = () => {
    setIsSessionMenuOpen(!isSessionMenuOpen);
  };
  
  const closeSessionMenu = () => {
    setIsSessionMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderLeft>
          <Logo to="/">Ki</Logo>
          
          <SessionButton 
            onClick={toggleSessionMenu}
            $isActive={isSessionMenuOpen}
            title="Manage Sessions"
            aria-label="Manage Sessions"
            aria-expanded={isSessionMenuOpen}
          >
            <span>📝</span>
            <div>{currentSession?.name || 'Current Session'}</div>
          </SessionButton>
          
          <KiSessionMenu
            sessionHistory={sessionHistory}
            currentSession={currentSession}
            onLoadSession={onLoadSession}
            onNewSession={onNewSession}
            onDeleteSession={onDeleteSession}
            isOpen={isSessionMenuOpen}
            onClose={closeSessionMenu}
          />
        </HeaderLeft>
        
        <HeaderRight>
          <DebugButton 
            active={isDebugMode} 
            onClick={toggleDebug}
            id="debug-button"
          >
            Debug
          </DebugButton>
        </HeaderRight>
      </HeaderContent>
    </HeaderContainer>
  );
};
