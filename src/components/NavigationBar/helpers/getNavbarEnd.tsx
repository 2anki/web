import Backend from '../../../lib/backend';
import BecomeAPatron from '../../BecomeAPatron';
import NavbarItem from '../NavbarItem';

export default function getNavbarEnd(
  path: string,
  backend: Backend,
  isPatreon: boolean
) {
  const onLogOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    backend.logout();
  };
  return (
    <div className="navbar-end">
      {!isPatreon && <BecomeAPatron />}
      <NavbarItem href="/search" path={path}>
        🔍 Search
      </NavbarItem>
      <NavbarItem path={path} href="/users/logout" onClick={onLogOut}>
        🔒 log out
      </NavbarItem>
    </div>
  );
}
