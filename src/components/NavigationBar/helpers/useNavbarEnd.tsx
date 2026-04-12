import React, { useState } from 'react';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import Backend from '../../../lib/backend';
import NavbarItem from '../NavbarItem';
import { useUserLocals } from '../../../lib/hooks/useUserLocals';
import styles from '../NavigationBar.module.css';
import sharedStyles from '../../../styles/shared.module.css';

export default function useNavbarEnd(path: string, backend: Backend) {
  const [isActive, setIsActive] = useState(false);
  const onLogOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    backend.logout();
  };

  const { isLoading, data } = useUserLocals();
  const isPaying = data?.locals?.patreon || data?.locals?.subscriber;
  const isLoggedIn = !!data?.user;
  const showKiLink = data?.features?.kiUI;

  const toggleDropdown = () => setIsActive(!isActive);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown();
    }
  };

  return (
    <div className={styles.navEnd}>
      {showKiLink && (
        <NavbarItem href="/ki" path={path}>
          KI 🧪
        </NavbarItem>
      )}
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
      <NavbarItem href="/search" path={path}>
        {getVisibleText('navigation.search')}
      </NavbarItem>
      {isLoggedIn && (
        <div className={styles.dropdown}>
          <button
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            className={styles.dropdownToggle}
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            type="button"
          >
            <img
              className={sharedStyles.avatar}
              src={
                data?.user?.picture ??
                `https://www.gravatar.com/avatar/${
                  data?.user?.email ?? ''
                }?s=32&d=mp`
              }
              alt="User avatar"
            />
          </button>
          <div
            className={`${styles.dropdownMenu} ${
              isActive ? styles.dropdownMenuActive : ''
            }`}
          >
            <NavbarItem href="/account" path={path}>
              Account
            </NavbarItem>
            <NavbarItem href="/favorites" path={path}>
              {getVisibleText('navigation.favorites')}
            </NavbarItem>
            <hr className={styles.dropdownDivider} />
            <a
              className={styles.dropdownItem}
              href="/users/logout"
              onClick={onLogOut}
            >
              {getVisibleText('navigation.logout')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
