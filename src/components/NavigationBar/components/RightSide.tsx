import React from 'react';

import NavbarItem from '../NavbarItem';
import { getVisibleText } from '../../../lib/text/getVisibleText';

interface RightSideProps {
  path: string;
}

export function RightSide({ path }: Readonly<RightSideProps>) {
  return <div className="navbar-end">
    <NavbarItem href="/contact" path={path}>
      {getVisibleText('navigation.contact')}
    </NavbarItem>
    <NavbarItem path="pricing" href="/pricing">
      {getVisibleText('navigation.pricing')}
    </NavbarItem>
    <NavbarItem path="login" href="/login#login">
      {getVisibleText('navigation.login')}
    </NavbarItem>
    <NavbarItem path="register" href="/register">
      {getVisibleText('navigation.register')}
    </NavbarItem>
  </div>;
}
