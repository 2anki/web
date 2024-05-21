import useNavbarEnd from '../helpers/useNavbarEnd';
import { get2ankiApi } from '../../../lib/backend/get2ankiApi';
import NavbarItem from '../NavbarItem';
import { getVisibleText } from '../../../lib/text/getVisibleText';

interface RightSideProps {
  cookies: Record<string, string>;
  path: string;
}

export function RightSide({ cookies, path }: Readonly<RightSideProps>) {
  if (cookies.token) {
    return useNavbarEnd(path, get2ankiApi());
  }
  return <div className="navbar-end">
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
