import { ReactNode } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import { canShowNavbar } from '../shared/canShowNavbar';
import { Menu } from './SideBar/Meny';
import { Layout, PageContent, PageHeader, PageSidebar } from './styled';

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
