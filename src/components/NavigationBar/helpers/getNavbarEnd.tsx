import React from 'react';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import Backend from '../../../lib/backend';
import NavbarItem from '../NavbarItem';

export default function getNavbarEnd(path: string, backend: Backend) {
  const onLogOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    backend.logout();
  };
  return (
    <div className="navbar-end">
      <NavbarItem href="/upload" path={path}>
        {getVisibleText('navigation.upload')}
      </NavbarItem>
      <NavbarItem href="/uploads" path={path}>
        {getVisibleText('navigation.uploads')}
      </NavbarItem>
      <NavbarItem href="/favorites" path={path}>
        {getVisibleText('navigation.favorites')}
      </NavbarItem>
      <NavbarItem href="/search" path={path}>
        {getVisibleText('navigation.search')}
      </NavbarItem>
      <NavbarItem path={path} href="/settings" onClick={onLogOut}>
        {getVisibleText('navigation.settings')}
      </NavbarItem>
      <NavbarItem path={path} href="/users/logout" onClick={onLogOut}>
        {getVisibleText('navigation.logout')}
      </NavbarItem>
    </div>
  );
}
