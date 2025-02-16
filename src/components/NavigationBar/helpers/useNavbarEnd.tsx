import React, { useState } from 'react';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import Backend from '../../../lib/backend';
import NavbarItem from '../NavbarItem';
import { getSearchPath } from './getSearchPath';
import { useUserLocals } from '../../../lib/hooks/useUserLocals';

export default function useNavbarEnd(path: string, backend: Backend) {
  const [isActive, setIsActive] = useState(false);
  const onLogOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    backend.logout();
  };

  const { isLoading, data } = useUserLocals();
  const isPaying = data?.locals?.patreon || data?.locals?.subscriber;
  const isLoggedIn = !!data?.user;

  const toggleDropdown = () => setIsActive(!isActive);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown();
    }
  };

  return (
    <div className="navbar-end">
      {!isLoading && !isPaying && (
        <NavbarItem href="/pricing" path={path}>
          {getVisibleText('navigation.pricing')}
        </NavbarItem>
      )}
      <NavbarItem href="/upload" path={path}>
        {getVisibleText('navigation.upload')}
      </NavbarItem>
      <NavbarItem href="/uploads" path={path}>
        {getVisibleText('navigation.uploads')}
      </NavbarItem>
      <NavbarItem href={getSearchPath('anki')} path={path}>
        {getVisibleText('navigation.search')}
      </NavbarItem>
      {isLoggedIn && (
        <div
          className={`navbar-item has-dropdown ${isActive ? 'is-active' : ''}`}
        >
          <button
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            className="navbar-link button is-ghost"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            type="button"
          >
            <figure className="image is-32x32">
              <img
                className="is-rounded"
                src={
                  data?.user?.picture ??
                  `https://www.gravatar.com/avatar/${data?.user?.email ?? ''}?s=32&d=mp`
                }
                alt="User avatar"
              />
            </figure>
          </button>
          <div className="navbar-dropdown is-right">
            <NavbarItem href="/account" path={path}>
              Account
            </NavbarItem>
            <NavbarItem href="/favorites" path={path}>
              {getVisibleText('navigation.favorites')}
            </NavbarItem>
            <hr className="navbar-divider" />
            <a className="navbar-item" href="/users/logout" onClick={onLogOut}>
              {getVisibleText('navigation.logout')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
