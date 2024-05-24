/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { Navbar } from './styled';
import { RightSide } from './components/RightSide';
import useNavbarEnd from './helpers/useNavbarEnd';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';

function NavigationBar() {
  const [cookies] = useCookies(['token']);
  const [active, setActive] = useState(false);
  const path = window.location.pathname;
  const loggedInNavbar = useNavbarEnd(path, get2ankiApi());

  return (
    <Navbar
      className="navbar is-flex is-justify-content-space-between is-flex-direction-column"
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
        {cookies.token && loggedInNavbar}
        {!cookies.token && <RightSide path={path} />}
      </div>

    </Navbar>
  );
}

export default NavigationBar;
