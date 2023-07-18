import { useCookies } from 'react-cookie';
import SidebarItem from './SidebarItem';
import Backend from '../../../lib/backend';
import { goToLoginPage } from '../../../pages/RegisterPage/goToLoginPage';
import { ProtectedItems } from './ProtectedItems';
import { getVisibleText } from '../../../lib/text/getVisibleText';

const backend = new Backend();

export function Menu() {
  const path = window.location.pathname;
  const [cookies] = useCookies(['token']);

  return (
    <aside
      className="menu is-flex is-flex-direction-column is-justify-content-space-between is-fullheight"
      style={{ height: '100vh' }}
    >
      <ul className="menu-list">
        <SidebarItem path={path} href="/upload">
          {getVisibleText('navigation.upload')}
        </SidebarItem>
        <ProtectedItems visible={cookies.token}>
          <SidebarItem href="/uploads" path={path}>
            {getVisibleText('navigation.uploads')}
          </SidebarItem>
          <SidebarItem path={path} href="/search">
            {getVisibleText('navigation.search')}
          </SidebarItem>
          <SidebarItem path={path} href="/favorites">
            {getVisibleText('navigation.favorites')}
          </SidebarItem>
        </ProtectedItems>
        <SidebarItem
          path={path}
          href="https://alemayhu.notion.site/FAQ-ef01be9c9bac41689a4d749127c14301"
          >
          {getVisibleText('navigation.help')}</SidebarItem>
      </ul>
      <ProtectedItems visible={cookies.token}>
        <ul className="menu-list">
          <hr />
          <SidebarItem path={path} href="/delete-account">
            🗑️ Delete account
          </SidebarItem>
          <SidebarItem
            path={path}
            href="/users/logout"
            onClick={(event) => {
              event.preventDefault();
              backend.logout().then(() => goToLoginPage());
            }}
          >
            🔒 log out
          </SidebarItem>
        </ul>
      </ProtectedItems>
    </aside>
  );
}
