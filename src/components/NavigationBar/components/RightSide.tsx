import React from 'react';
import NavbarItem from '../NavbarItem';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import { LoginButton } from './LoginButton';

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
    <LoginButton className="button has-text-white m-2" href="/login#login">
      {getVisibleText('navigation.login')}
    </LoginButton>
  </div>;
}
