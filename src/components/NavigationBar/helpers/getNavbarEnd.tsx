import Backend from '../../../lib/Backend';
import BecomeAPatron from '../../BecomeAPatron';
import NavbarItem from '../NavbarItem';

export default function getNavbarEnd(path: string, backend: Backend, isPatreon: boolean) {
  const onLogOut = (event) => {
    event.preventDefault();
    backend.logout();
  };
  return (
    <div className="navbar-end">
      {!isPatreon && (
        <BecomeAPatron />
      )}
      <NavbarItem href="/search" path={path}>
        🔍 Search
      </NavbarItem>
      <NavbarItem
        path={path}
        href="/users/logout"
        onClick={onLogOut}
      >
        🔒 log out
      </NavbarItem>
    </div>
  );
}
