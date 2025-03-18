export const getSubscribeLink = () =>
  process.env.NODE_ENV === 'development'
    ? 'https://buy.stripe.com/test_fZebM83k00Rj6PeeUU'
    : 'https://buy.stripe.com/cN2cPC6ek7RCbjGdQU';

export const getLifetimeLink = () =>
  'mailto:support@2anki.net?subject=Lifetime%20Access%20for%202anki.net&body=Hello,%20I%20would%20like%20to%20purchase%20a%20lifetime%20access%20for%202anki.net.';
