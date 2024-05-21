import React from 'react';
import { useQuery } from 'react-query';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import Backend from '../../../lib/backend';
import NavbarItem from '../NavbarItem';
import { getUserLocals } from '../../../lib/backend/getUserLocals';

export default function getNavbarEnd(path: string, backend: Backend) {
  const onLogOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    backend.logout();
  };

  const { isLoading, data } = useQuery(
    'userlocals',
    getUserLocals,
    {
      cacheTime: 0
    }
  );
  const isPaying = data?.locals?.patreon || data?.locals?.subscriber;

  return (
    <div className="navbar-end">
      {!isLoading && !isPaying && <NavbarItem href="/pricing" path={path}>
        {getVisibleText('navigation.pricing')}
      </NavbarItem>}
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
      <NavbarItem path={path} href="/settings">
        {getVisibleText('navigation.settings')}
      </NavbarItem>
      <NavbarItem path={path} href="/users/logout" onClick={onLogOut}>
        {getVisibleText('navigation.logout')}
      </NavbarItem>
    </div>
  );
}
