export const getSubscribeLink = () =>
  process.env.NODE_ENV === 'development' ?
    'https://buy.stripe.com/test_fZebM83k00Rj6PeeUU' :
    'https://buy.stripe.com/eVadTGcCI6Ny73qfZ0';
