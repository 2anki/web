import React, { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { getSubscribeLink } from '../../../pages/PricingPage/payment.links';

interface SubscriptionModalProps {
  isActive: boolean;
  onClickClose: (event?: SyntheticEvent) => void;
  isLoggedIn: boolean;
  limitType: 'cards' | 'size';
  currentValue: number; // Keeping for future use if needed
  limitValue: number;
}

function SubscriptionModal({
  isActive,
  onClickClose,
  isLoggedIn,
  limitType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentValue,
  limitValue,
}: Readonly<SubscriptionModalProps>) {
  const subscribeLink = isLoggedIn ? getSubscribeLink() : '/login';
  
  const getLimitMessage = () => {
    if (limitType === 'cards') {
      return `Your upload exceeds the free limit of ${limitValue} cards.`;
    }
    return `Your upload exceeds the free limit of ${(limitValue / (1024 * 1024)).toFixed(1)}MB.`;
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <button 
        type="button"
        className="modal-background" 
        onClick={onClickClose} 
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClickClose();
          }
        }}
        aria-label="Close modal"
      />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Free Tier Limit Reached</p>
          <button
            type="button"
            className="delete"
            aria-label="close"
            onClick={onClickClose}
          />
        </header>
        <section className="modal-card-body">
          <div className="container">
            <div className="notification is-warning">
              <p>{getLimitMessage()}</p>
            </div>
            
            <h3 className="title is-4 mt-4">Upgrade to Premium</h3>
            <p className="mb-4">
              Upgrade to our Subscriber Plan for just $2/month to enjoy:
            </p>
            
            <ul className="mb-4">
              <li>✅ Unlimited flashcards (9GB++)</li>
              <li>✅ PDF support using Vertex AI</li>
              <li>✅ Cancel anytime - no commitment required</li>
            </ul>
            
            <div className="has-text-centered mt-5">
              <p className="mb-3">
                <strong>Ready to unlock the full potential of 2anki.net?</strong>
              </p>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot is-justify-content-center" style={{ gap: '1rem' }}>
          {isLoggedIn ? (
            <a
              href={subscribeLink}
              className="button is-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe Now
            </a>
          ) : (
            <Link to="/login?redirect=pricing" className="button is-link">
              Login to Subscribe
            </Link>
          )}
          <button type="button" className="button" onClick={onClickClose}>
            Continue with Limitations
          </button>
        </footer>
      </div>
    </div>
  );
}

export default SubscriptionModal;
