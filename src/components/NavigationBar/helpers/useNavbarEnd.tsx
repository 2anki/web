import React, { useEffect, useRef, useState } from 'react';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import Backend from '../../../lib/backend';
import NavbarItem from '../NavbarItem';
import { useUserLocals } from '../../../lib/hooks/useUserLocals';
import { useFavoritesCount } from '../../../lib/hooks/useFavoritesCount';
import styles from '../NavigationBar.module.css';

export default function useNavbarEnd(path: string, backend: Backend) {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onLogOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const confirmed = globalThis.confirm('Are you sure you want to log out?');
    if (!confirmed) return;
    backend.logout();
  };

  const { isLoading, data } = useUserLocals();
  const isPaying = data?.locals?.patreon || data?.locals?.subscriber;
  const isLoggedIn = !!data?.user;
  const showKiLink = data?.features?.kiUI;
  const favoritesCount = useFavoritesCount(isLoggedIn);

  const toggleDropdown = () => setIsActive((prev) => !prev);
  const closeDropdown = () => setIsActive(false);

  useEffect(() => {
    if (!isActive) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive]);

  return (
    <div className={styles.navEnd}>
      {showKiLink && (
        <NavbarItem href="/ki" path={path}>
          KI 🧪
        </NavbarItem>
      )}
      <NavbarItem href="/upload" path={path}>
        {getVisibleText('navigation.upload')}
      </NavbarItem>
      <NavbarItem href="/uploads" path={path}>
        {getVisibleText('navigation.uploads')}
      </NavbarItem>
      {!isLoading && !isPaying && (
        <NavbarItem href="/pricing" path={path}>
          {getVisibleText('navigation.pricing')}
        </NavbarItem>
      )}
      {isLoggedIn && (
        <div className={styles.dropdown} id="navbar-user-menu" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className={styles.dropdownToggle}
            aria-haspopup="true"
            aria-expanded={isActive}
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
            onClick={closeDropdown}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeDropdown();
            }}
          >
            <NavbarItem href="/account" path={path}>
              Account
            </NavbarItem>
            <NavbarItem href="/search" path={path}>
              {getVisibleText('navigation.search')}
            </NavbarItem>
            {favoritesCount > 0 && (
              <NavbarItem href="/favorites" path={path}>
                {getVisibleText('navigation.favorites')}
              </NavbarItem>
            )}
            <NavbarItem href="/documentation" path={path}>
              {getVisibleText('navigation.documentation')}
            </NavbarItem>
            <NavbarItem href="/contact" path={path}>
              {getVisibleText('navigation.contact')}
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
