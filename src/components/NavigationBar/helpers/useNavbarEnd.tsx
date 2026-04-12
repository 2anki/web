import React, { useState } from 'react';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import Backend from '../../../lib/backend';
import NavbarItem from '../NavbarItem';
import { useUserLocals } from '../../../lib/hooks/useUserLocals';
import styles from '../NavigationBar.module.css';

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
        <div className={styles.dropdown} id="navbar-user-menu">
          <button
            onClick={toggleDropdown}
            className={styles.dropdownToggle}
            aria-haspopup="true"
            aria-controls="navbar-user-menu"
            aria-label="Account menu"
            type="button"
          >
            <span className={styles.dropdownToggleText}>⋯</span>
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
