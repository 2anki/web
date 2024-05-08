import styled from 'styled-components';

export const Navbar = styled.nav`
    background: #e5e5e5;
    @media (max-width: 1024px) {
        margin: 0;
    }
`;

export const StyledNavbarItem = styled.a`
    font-size: 20px;
    color: #1364e3;

    :hover {
        font-weight: bold;
    }
`;
