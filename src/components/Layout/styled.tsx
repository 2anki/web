import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const PageContent = styled.div`
  flex-basis: 0;
  flex-grow: 999;
`;

export const PageHeader = styled.div.attrs({ className: 'is-hidden-desktop' })`
  width: 100%;
`;

export const ClaudePromoBanner = styled.div`
  background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%);
  border-bottom: 1px solid #c4b5fd;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  color: #4c1d95;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;

  a {
    color: #7c3aed;
    font-weight: 600;
    text-decoration: underline;
  }
`;
