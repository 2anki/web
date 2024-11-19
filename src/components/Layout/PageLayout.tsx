import { ReactNode } from 'react';
import { PageContent } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import NavigationBar from '../NavigationBar/NavigationBar';

interface PageLayoutProps {
  children: ReactNode;
  error?: Error | null;
}

export function PageLayout({ children, error }: Readonly<PageLayoutProps>) {
  return (
    <PageContent>
      <NavigationBar />
      {error && <ErrorPresenter error={error} />}
      {children}
    </PageContent>
  );
}
