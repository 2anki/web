import React, { useState } from 'react';
import styled from 'styled-components';
import { SessionHistory, Session } from '../types';

interface KiSidebarProps {
  sessionHistory: SessionHistory | null;
  currentSession: Session | null;
  onLoadSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props => props.isCollapsed ? '60px' : '260px'};
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-md);
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h2<{ isCollapsed: boolean }>`
  margin: 0;
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  white-space: nowrap;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity 0.2s ease;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  border-radius: 50%;
  
  &:hover {
    background: var(--hover-bg);
    color: var(--primary);
  }
`;

const SessionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
`;

const SessionItem = styled.div<{ isActive: boolean, isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '12px' : '12px 16px'};
  margin: 0 ${props => props.isCollapsed ? '8px' : '12px'} 8px;
  border-radius: var(--radius-md);
  background: ${props => props.isActive ? 'var(--primary-light)' : 'transparent'};
  color: ${props => props.isActive ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  transition: all var(--transition-normal);
  position: relative;
  
  &:hover {
    background: ${props => props.isActive ? 'var(--primary)' : 'var(--hover-bg)'};
  }
`;

const SessionIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
`;

const SessionName = styled.div<{ isCollapsed: boolean }>`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  max-width: ${props => props.isCollapsed ? 0 : '180px'};
  transition: opacity 0.2s ease, max-width 0.3s ease;
`;

const SessionActions = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity 0.2s ease;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity var(--transition-normal);
  
  &:hover {
    opacity: 1;
  }
`;

const NewSessionButton = styled.button<{ isCollapsed: boolean }>`
  margin: ${props => props.isCollapsed ? '12px auto' : '12px 16px'};
  padding: ${props => props.isCollapsed ? '12px' : '12px 16px'};
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  width: ${props => props.isCollapsed ? '40px' : 'calc(100% - 32px)'};
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ButtonText = styled.span<{ isCollapsed: boolean }>`
  margin-left: 8px;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  max-width: ${props => props.isCollapsed ? 0 : '200px'};
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.2s ease, max-width 0.3s ease;
`;

export function KiSidebar({
  sessionHistory,
  currentSession,
  onLoadSession,
  onNewSession,
  onDeleteSession,
  isCollapsed,
  toggleCollapse
}: KiSidebarProps): React.ReactElement {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete === 'current') {
      onDeleteSession();
      setConfirmDelete(null);
    } else {
      setConfirmDelete('current');
    }
  };
  
  const handleSessionClick = (sessionId: string) => {
    setConfirmDelete(null);
    onLoadSession(sessionId);
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <SidebarHeader>
        <SidebarTitle isCollapsed={isCollapsed}>Sessions</SidebarTitle>
        <CollapseButton onClick={toggleCollapse} title={isCollapsed ? 'Expand' : 'Collapse'}>
          {isCollapsed ? '→' : '←'}
        </CollapseButton>
      </SidebarHeader>
      
      <NewSessionButton 
        onClick={onNewSession} 
        isCollapsed={isCollapsed}
        title="New Session"
      >
        <span>🔁</span>
        <ButtonText isCollapsed={isCollapsed}>New Session</ButtonText>
      </NewSessionButton>
      
      <SessionList>
        {sessionHistory?.sessions.map(session => (
          <SessionItem 
            key={session.id}
            isActive={currentSession?.id === session.id}
            isCollapsed={isCollapsed}
            onClick={() => handleSessionClick(session.id)}
          >
            <SessionIcon>📝</SessionIcon>
            <SessionName isCollapsed={isCollapsed}>
              {session.name || `Session ${new Date(session.createdAt).toLocaleString()}`}
            </SessionName>
            <SessionActions isCollapsed={isCollapsed}>
              {/* Session deletion handled through current session only */}
            </SessionActions>
          </SessionItem>
        ))}
        
        {/* Current session if not in history */}
        {currentSession && (
          <SessionItem 
            isActive
            isCollapsed={isCollapsed}
          >
            <SessionIcon>📝</SessionIcon>
            <SessionName isCollapsed={isCollapsed}>
              {currentSession.name || 'Current Session'}
            </SessionName>
            <SessionActions isCollapsed={isCollapsed}>
              <ActionButton 
                onClick={(e) => handleDeleteClick(e)}
                title={confirmDelete === 'current' ? 'Confirm delete' : 'Delete session'}
              >
                {confirmDelete === 'current' ? '✓' : '❌'}
              </ActionButton>
            </SessionActions>
          </SessionItem>
        )}
        
        {(!sessionHistory || sessionHistory.sessions.length === 0) && (
          <SessionItem 
            isActive={false}
            isCollapsed={isCollapsed}
          >
            <SessionIcon>ℹ️</SessionIcon>
            <SessionName isCollapsed={isCollapsed}>
              No saved sessions
            </SessionName>
          </SessionItem>
        )}
      </SessionList>
    </SidebarContainer>
  );
}
