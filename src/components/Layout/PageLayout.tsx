import { ReactNode } from 'react';
<<<<<<< HEAD
=======
import { PageContent } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
>>>>>>> origin/main
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
  return <PageContent>
    <NavigationBar />
    {error && <ErrorPresenter error={error} />}
    {children}
  </PageContent>;
}
