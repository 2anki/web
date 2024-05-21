import React from 'react';

interface PricingCardProp {
  price: string;
  title: string;
  benefits: string[];
  link?: string;
  linkText?: string;
}

export function PricingCard({ price, title, benefits, linkText, link }: PricingCardProp) {
  return <div className="card">
    <div className="card-header">
      <p className="card-header-title">
        {price} / {title}
      </p>
    </div>
    <div className="card-content">
      <div className="content">
        <ul>
          {benefits.map((benefit) => (<li key={benefit}>{benefit}</li>))}
        </ul>
      </div>
    </div>
    {link && linkText && <div className="card-footer">
      <a href={link} className="card-footer-item button is-link">
        {linkText}
      </a>
    </div>}
  </div>;
}
