import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageContent, ClaudePromoBanner } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import NavigationBar from '../NavigationBar/NavigationBar';
import Footer from '../Footer';
import sharedStyles from '../../styles/shared.module.css';

interface PageLayoutProps {
  isLoggedIn: boolean;
  isPaying: boolean;
  children: ReactNode;
  error?: Error | null;
}

export function PageLayout({
  children,
  error,
  isLoggedIn,
  isPaying,
}: Readonly<PageLayoutProps>) {
  const [claudeEnabled, setClaudeEnabled] = useState(
    localStorage.getItem('claude-ai-flashcards') === 'true'
  );
  const { pathname } = useLocation();
  const showPromo = pathname === '/upload';

  const toggleClaude = () => {
    const next = !claudeEnabled;
    setClaudeEnabled(next);
    localStorage.setItem('claude-ai-flashcards', String(next));
  };

  return (
    <PageContent>
      <NavigationBar isLoggedIn={isLoggedIn} />
      {isLoggedIn && isPaying && showPromo && (
        <ClaudePromoBanner>
          <label className={sharedStyles.claudeLabel}>
            <input
              type="checkbox"
              checked={claudeEnabled}
              onChange={toggleClaude}
            />
            ✨ Generate flashcards with Claude AI
          </label>
        </ClaudePromoBanner>
      )}
      {isLoggedIn && !isPaying && showPromo && (
        <ClaudePromoBanner>
          ✨{' '}
          <span>
            Subscribers can generate flashcards with Claude AI for better
            results. <Link to="/pricing">Upgrade your plan</Link>
          </span>
        </ClaudePromoBanner>
      )}
      {error && <ErrorPresenter error={error} />}
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </PageContent>
  );
}
