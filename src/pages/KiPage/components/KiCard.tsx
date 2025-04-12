import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../types';

interface KiCardProps {
  card: Card;
  isDebugMode: boolean;
}

const CardContainer = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
  cursor: pointer;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--primary-light);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: var(--shadow-sm);
  }
`;

const CardHeader = styled.div`
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  font-weight: var(--font-weight-semibold);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-secondary);
`;

const CardContent = styled.div`
  padding: var(--spacing-lg);
  line-height: 1.6;
`;

const CardFront = styled.div`
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
`;

const CardBack = styled.div`
  border-top: 1px dashed var(--border-color);
  padding-top: var(--spacing-lg);
  color: var(--text-secondary);
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-lg);
`;

const Tag = styled.span`
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--hover-bg);
    color: var(--primary);
    transform: translateY(-1px);
  }
`;

const DeckLabel = styled.div`
  background: var(--primary-light);
  color: white;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.02em;
  box-shadow: var(--shadow-sm);
`;

const DebugInfo = styled.pre`
  background: var(--bg-tertiary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 12px;
  overflow-x: auto;
  margin-top: var(--spacing-lg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  line-height: 1.5;
`;

export function KiCard({ card, isDebugMode }: KiCardProps): React.ReactElement | null {
  const [isFlipped, setIsFlipped] = useState(false);

  // If this is a deck name card (no front/back) or an empty card
  if ((card.deck && !card.front && !card.back) || (!card.front && !card.back)) {
    return null;
  }

  return (
    <CardContainer onClick={() => setIsFlipped(!isFlipped)}>
      <CardHeader>
        {card.deck && <DeckLabel>{card.deck}</DeckLabel>}
        <span style={{ fontSize: '11px' }}>Basic flashcard</span>
      </CardHeader>
      <CardContent>
        <CardFront>
          <h3 style={{ fontSize: '14px' }}>Front</h3>
          {/* eslint-disable-next-line react/no-danger */}
          <div data-testid="card-front" dangerouslySetInnerHTML={{ __html: card.front }} />
        </CardFront>
        
        {isFlipped && (
          <CardBack>
            <h3 style={{ fontSize: '14px' }}>Back</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <div data-testid="card-back" dangerouslySetInnerHTML={{ __html: card.back }} />
          </CardBack>
        )}
        
        {card.tags && card.tags.length > 0 && (
          <CardTags>
            {/* Using the tag itself as the key is safe if tags are unique */}
            {card.tags.map((tag) => (
              <Tag key={`tag-${tag}`}>{tag}</Tag>
            ))}
          </CardTags>
        )}
        
        {isDebugMode && (
          <DebugInfo>
            {JSON.stringify(card, null, 2)}
          </DebugInfo>
        )}
      </CardContent>
    </CardContainer>
  );
};
