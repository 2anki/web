import styled from 'styled-components';
import React from 'react';
import HeadingDash from './HeadingDash';

interface Props {
  id: string;
  isDashed: boolean;
  children: React.ReactNode;
}

const StyledHeading2 = styled.h2`
  font-family: var(--font-sans);
  font-style: normal;
  font-weight: var(--font-semibold);
  font-size: var(--text-5xl);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);

  color: #2b2e3c;

  @media (max-width: 1024px) {
    font-size: var(--text-3xl);
  }
`;

function Heading2({ id, isDashed, children }: Props) {
  return (
    <StyledHeading2 id={id}>
      {children}
      {isDashed && <HeadingDash />}
    </StyledHeading2>
  );
}

export default Heading2;
