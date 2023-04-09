/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import Backend from '../../lib/backend';
import NavbarItem from './NavbarItem';
import { Navbar } from './styled';
import getNavbarEnd from './helpers/getNavbarEnd';
import { canShowNavbar } from '../shared/canShowNavbar';

const backend = new Backend();

function NavigationBar() {
  const [cookies] = useCookies(['token']);
  const [active, setHamburgerMenu] = useState(false);
  const path = window.location.pathname;

  if (!canShowNavbar(path)) {
    return null;
  }

  return (
    <Navbar className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item has-text-weight-bold" href="/">
          <img src="/mascot/navbar-logo.png" alt="2anki Logo" />
        </a>
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          onKeyDown={() => setHamburgerMenu(!active)}
          onClick={() => setHamburgerMenu(!active)}
          tabIndex={0}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div id="navbar" className={`navbar-menu ${active ? 'is-active' : ''}`}>
        {!cookies.token && (
          <div className="navbar-end">
            <NavbarItem path="login" href="/login#login">
              Login
            </NavbarItem>
            <NavbarItem path="register" href="/login#register">
              Register
            </NavbarItem>
          </div>
        )}
        {cookies.token && getNavbarEnd(path, backend)}
      </div>
    </Navbar>
  );
}

export default NavigationBar;
