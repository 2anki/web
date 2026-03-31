import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageContent, ClaudePromoBanner } from './styled';
import { ErrorPresenter } from '../errors/ErrorPresenter';
import NavigationBar from '../NavigationBar/NavigationBar';
import AnthropicConsentModal, {
  ANTHROPIC_ENABLED_KEY,
  ANTHROPIC_CONSENT_SHOWN_KEY,
} from '../modals/AnthropicConsentModal/AnthropicConsentModal';

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
  const [anthropicEnabled, setAnthropicEnabled] = useState(
    localStorage.getItem(ANTHROPIC_ENABLED_KEY) === 'true'
  );
  const [showConsentModal, setShowConsentModal] = useState(
    isLoggedIn && isPaying && localStorage.getItem(ANTHROPIC_CONSENT_SHOWN_KEY) !== 'true'
  );
  const { pathname } = useLocation();
  const showPromo = pathname !== '/search';

  const toggleAnthropic = () => {
    const next = !anthropicEnabled;
    setAnthropicEnabled(next);
    localStorage.setItem(ANTHROPIC_ENABLED_KEY, String(next));
  };

  const handleConsentClose = () => {
    setAnthropicEnabled(localStorage.getItem(ANTHROPIC_ENABLED_KEY) === 'true');
    setShowConsentModal(false);
  };

  return (
    <PageContent>
      <NavigationBar isLoggedIn={isLoggedIn} />
      {isLoggedIn && isPaying && showPromo && (
        <ClaudePromoBanner>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={anthropicEnabled}
              onChange={toggleAnthropic}
            />
            ✨ Recommended AI (Anthropic) enabled — higher quality flashcards
          </label>
          {!anthropicEnabled && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
              · Not using the recommended setup — output quality may be affected
            </span>
          )}
        </ClaudePromoBanner>
      )}
      {isLoggedIn && !isPaying && showPromo && (
        <ClaudePromoBanner>
          ✨{' '}
          <span>
            Subscribers get higher quality flashcards with the recommended AI (Anthropic).{' '}
            <Link to="/pricing">Upgrade your plan</Link>
          </span>
        </ClaudePromoBanner>
      )}
      {isLoggedIn && isPaying && showConsentModal && (
        <AnthropicConsentModal onClose={handleConsentClose} />
      )}
      {error && <ErrorPresenter error={error} />}
      {children}
    </PageContent>
  );
}
