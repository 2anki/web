import Backend from '../../../lib/Backend';
import BecomeAPatron from '../../BecomeAPatron';
import NavbarItem from '../NavbarItem';

export default function getNavbarEnd(path: string, backend: Backend, isPatreon: boolean) {
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
        onClick={(event) => {
          event.preventDefault();
          backend.logout();
        }}
      >
        🔒 log out
      </NavbarItem>
    </div>
  );
}
