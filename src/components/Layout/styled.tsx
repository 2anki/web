import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const PageSidebar = styled.div`
  flex-basis: 20rem;
  flex-grow: 1;
  height: 100vh;
  position: sticky;
  top: 0;
`;
export const PageContent = styled.div`
  flex-basis: 0;
  flex-grow: 999;
`;
