import React from 'react';
import { StyledButton } from './styled';

interface PrimaryButtonProps {
  text: string;
  destination: string;
  onClickLink: React.MouseEventHandler;
}

export default function PrimaryButton({
                                        text,
                                        destination,
                                        onClickLink
                                      }: PrimaryButtonProps) {
  return (
    <StyledButton>
      {destination.includes('http') ? (
        <a href={destination} rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        <a onClick={onClickLink} href={destination}>
          {text}
        </a>
      )}
      <img width={24} height={24} src="/icons/arrow-right.svg" alt="arrow" />
    </StyledButton>
  );
}
