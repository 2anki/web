import styled from 'styled-components';

export const SearchInput = styled.input`
  width: 60vw;
  max-width: 640px;
`;

export const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  padding: 2rem;
  background: white;
`;

export const Details = styled.details`
  border-bottom: 1px solid var(--color-border);

  summary {
    padding: 0.75rem 0;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.4;
    cursor: pointer;
    color: var(--color-text-primary);
    list-style: none;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '';
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  &[open] summary {
    color: var(--color-primary);
  }

  &[open] summary::after {
    transform: rotate(-135deg);
  }

  & > *:not(summary) {
    padding-bottom: 0.75rem;
  }
`;

export const ButtonWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
