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
