import { ReactNode } from 'react';
import { PageContent, Layout, PageSidebar, PageHeader } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import { Menu } from './SideBar/Meny';
import { canShowNavbar } from '../shared/canShowNavbar';
import NavigationBar from '../NavigationBar/NavigationBar';

interface LayoutProps {
  error: unknown;
  children: ReactNode;
}

export function PageLayout({ error, children }: Readonly<LayoutProps>) {
  const hideMeny =
    !canShowNavbar(window.location.pathname) ||
    window.location.pathname === '/';

  if (hideMeny) {
    return (
      <PageContent>
        {error && <ErrorPresenter error={error} />}
        {children}
      </PageContent>
    );
  }

  return (
    <>
      <PageHeader>
        <NavigationBar />
      </PageHeader>
      <Layout>
        <PageSidebar>
          <Menu />
        </PageSidebar>
        <PageContent>
          <ErrorPresenter error={error} />
          {children}
        </PageContent>
      </Layout>
    </>
  );
}
