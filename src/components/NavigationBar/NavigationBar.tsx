/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { canShowNavbar } from '../shared/canShowNavbar';
import NavbarItem from './NavbarItem';
import getNavbarEnd from './helpers/getNavbarEnd';
import { Navbar } from './styled';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';

function NavigationBar() {
  const [cookies] = useCookies(['token']);
  const [active, setActive] = useState(false);

  const path = window.location.pathname;

  if (!canShowNavbar(path)) {
    return null;
  }

  const rightSide = cookies.token ? (
    getNavbarEnd(path, get2ankiApi())
  ) : (
    <div className="navbar-end">
      <NavbarItem path="login" href="/login#login">
        Login
      </NavbarItem>
      <NavbarItem path="register" href="/register">
        Register
      </NavbarItem>
    </div>
  );

  return (
    <Navbar
      className="navbar is-flex is-flex-direction-row is-justify-content-space-around	"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item has-text-weight-bold" href="/">
          <img src="/mascot/navbar-logo.png" alt="2anki Logo" />
        </a>
        <button
          type="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          onKeyDown={() => setActive(!active)}
          onClick={() => setActive(!active)}
          tabIndex={0}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        id="navbar"
        className={`is-flex-grow-0	navbar-menu ${active ? 'is-active' : ''}`}
      >
        {rightSide}
      </div>
    </Navbar>
  );
}

export default NavigationBar;
