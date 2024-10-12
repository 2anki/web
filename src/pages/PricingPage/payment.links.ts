export const getSubscribeLink = () =>
  process.env.NODE_ENV === 'development' ?
    'https://buy.stripe.com/test_fZebM83k00Rj6PeeUU' :
    'https://buy.stripe.com/cN2cPC6ek7RCbjGdQU';

export const getLifetimeLink = () =>
  process.env.NODE_ENV === 'development' ?
    'https://buy.stripe.com/test_14kbM82fW43v6PeeUV' :
    'https://buy.stripe.com/28obLyeKQ3BmcnK8wB';
