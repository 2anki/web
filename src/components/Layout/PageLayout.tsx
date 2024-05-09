import { ReactNode } from 'react';
import { PageContent } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import NavigationBar from '../NavigationBar/NavigationBar';

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
