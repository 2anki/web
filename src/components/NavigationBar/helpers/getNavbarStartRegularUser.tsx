import { getTemplateServiceUrl } from '../../../lib/backend/getTemplateServiceUrl';
import NavbarItem from '../NavbarItem';

export default function getNavbarStartRegularUser(path: string) {
  return (
    <>
      <NavbarItem href="/upload" path={path}>
        📦 Upload
      </NavbarItem>
      <NavbarItem href="/uploads/mine" path={path}>
        🗂 My Uploads
      </NavbarItem>
      <NavbarItem href={getTemplateServiceUrl()} path={path}>
        👩🏼‍🎨 Templates
      </NavbarItem>
      <NavbarItem href="/favorites" path={path}>
       ⭐️Favorites
      </NavbarItem>
    </>
  );
}
