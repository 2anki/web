import React from 'react';
import { getPaymentPortalLink } from '../helpers/getPaymentPortalLink';

interface PlanDetailsProps {
  subscriptionType: 'subscriber' | 'lifetime' | 'free';
}

export function PlanDetails({ subscriptionType }: PlanDetailsProps) {
  if (subscriptionType === 'subscriber') {
    return (
      <div className="box">
        <div className="level">
          <div className="level-left">
            <div>
              <h3 className="title is-5 mb-2">Monthly Subscription</h3>
              <ul>
                <li>Unlimited Flashcards (9GB++)</li>
                <li>PDF support using Vertex AI</li>
                <li>Priority Support</li>
              </ul>
            </div>
          </div>
          <div className="level-right">
            <a
              href={getPaymentPortalLink()}
              className="button is-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage Subscription
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptionType === 'lifetime') {
    return (
      <div className="box">
        <h3 className="title is-5 mb-2">Lifetime Access</h3>
        <p className="subtitle is-6 mb-3">Valid forever</p>
        <ul>
          <li>Unlimited Flashcards (9GB++)</li>
          <li>PDF support using Vertex AI</li>
          <li>Priority Support</li>
          <li>All Future Updates</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="box">
      <div className="level">
        <div className="level-left">
          <div>
            <h3 className="title is-5 mb-2">Free Plan</h3>
            <ul>
              <li>100 flashcards per upload</li>
              <li>Max upload size: 100mb</li>
              <li>Community Support</li>
            </ul>
          </div>
        </div>
        <div className="level-right">
          <a href="/pricing" className="button is-primary">
            Upgrade Now
          </a>
        </div>
      </div>
    </div>
  );
}
