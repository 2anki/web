import styled from 'styled-components';

export const Navbar = styled.nav`
  background: #e5e5e5;
  @media (max-width: 1024px) {
    margin: 0;

    .navbar-brand {
      width: 100%;
    }
  }
`;

export const StyledNavbarItem = styled.a`
  font-size: 20px;
  :hover {
    font-weight: bold;
  }
`;
