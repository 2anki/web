import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ProcessingState } from '../types';

interface KiProcessingStateProps {
  state: ProcessingState;
  onCancel: () => void;
}

const Container = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-lg);
  border-left: 3px solid var(--primary);
`;

const Icon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: var(--spacing-lg);
  color: var(--primary);
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-primary);
  font-size: 16px;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
`;

const ProgressContainer = styled.div`
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, var(--primary-light), var(--primary));
  width: ${props => `${props.progress}%`};
  transition: width 0.3s ease-out;
  border-radius: 8px;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
  font-size: 14px;
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-light);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const FileIcon = styled.div`
  margin-right: var(--spacing-sm);
  color: var(--primary);
`;

const FileName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid var(--bg-tertiary);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: var(--spacing-sm);
  box-shadow: 0 0 0 4px rgba(66, 99, 235, 0.05);

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Timer = styled.span`
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: var(--spacing-xs);
`;

const CancelButton = styled.button`
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: none;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-normal);
  margin-left: auto;

  &:hover {
    background: var(--error);
    color: white;
  }
`;

export function KiProcessingState({ state, onCancel }: KiProcessingStateProps): React.ReactElement {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Update timer every second
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format elapsed time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };
  
  return (
    <Container className="processing-state">
      <Icon>📝</Icon>
      <Content>
        <Title>
          Processing content
          <Spinner />
          <Timer>{formatTime(elapsedTime)}</Timer>
        </Title>
        <Subtitle>
          <span className="status-message">{state.message || 'Starting process...'}</span>
        </Subtitle>
        <ProgressContainer>
          <ProgressBar progress={state.progress || 0} />
        </ProgressContainer>
        
        {state.files && state.files.length > 0 && (
          /* Using the file name as the key is safe if file names are unique */
          state.files.map((file) => (
            <FilePreview key={`file-${file.name}`}>
              <FileIcon>📁</FileIcon>
              <FileName>{file.name}</FileName>
            </FilePreview>
          ))
        )}
        
        {state.text && (
          <FilePreview>
            <FileIcon>📄</FileIcon>
            <FileName>
              {state.text.length > 100 
                ? `${state.text.slice(0, 100)}...` 
                : state.text}
            </FileName>
          </FilePreview>
        )}
      </Content>
      <CancelButton onClick={onCancel}>Cancel</CancelButton>
    </Container>
  );
};
