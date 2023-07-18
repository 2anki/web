import NavbarItem from '../NavbarItem';
import { getVisibleText } from '../../../lib/text/getVisibleText';

export default function getNavbarStartRegularUser(path: string) {
  return (
    <>
      <NavbarItem href="/upload" path={path}>
        {getVisibleText('navigation.upload')}
      </NavbarItem>
      <NavbarItem href="/uploads" path={path}>
        {getVisibleText('navigation.uploads')}
      </NavbarItem>
      <NavbarItem href="/favorites" path={path}>
        {getVisibleText('navigation.favorites')}
      </NavbarItem>
    </>
  );
}
