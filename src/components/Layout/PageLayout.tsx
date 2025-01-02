import { ReactNode } from 'react';
import { PageContent } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import NavigationBar from '../NavigationBar/NavigationBar';

interface PageLayoutProps {
  isLoggedIn: boolean;
  children: ReactNode;
  error?: Error | null;
}

export function PageLayout({
  children,
  error,
  isLoggedIn,
}: Readonly<PageLayoutProps>) {
  return (
    <PageContent>
      <NavigationBar isLoggedIn={isLoggedIn} />
      {error && <ErrorPresenter error={error} />}
      {children}
    </PageContent>
  );
}
