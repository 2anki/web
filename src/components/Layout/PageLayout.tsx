import { ReactNode } from 'react';
import { PageContent, Layout, PageSidebar } from './styled';
// import NavigationBar from '../NavigationBar/NavigationBar';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import { ErrorType } from '../errors/helpers/types';
import { Menu } from './SideBar/Meny';

interface LayoutProps {
  error: ErrorType;
  children: ReactNode;
}

export function PageLayout({error, children}: LayoutProps) {
  const hideMeny = window.location.pathname === '/';
  return <Layout>
    {!hideMeny && <PageSidebar>
      <Menu />
      <ErrorPresenter error={error} />
    </PageSidebar>}
    <PageContent>
      {children}
    </PageContent>
</Layout>
}