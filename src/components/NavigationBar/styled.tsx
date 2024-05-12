import styled from 'styled-components';

export const Navbar = styled.nav`
    background: #e5e5e5;
    padding-right: 1rem;
    @media (min-width: 1024px) {
        margin: 0;
        flex-direction: row !important;
        padding-right: 3rem;
    }

    border-bottom: lightgrey 1px solid;
`;

export const StyledNavbarItem = styled.a`
    font-size: 20px;
    color: #1364e3;

    :hover {
        font-weight: bold;
    }
`;
