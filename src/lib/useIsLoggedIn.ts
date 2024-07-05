import { useCookies } from 'react-cookie';

export const useIsLoggedIn = () => {
  const [cookies] = useCookies(['token']);
  return cookies.token;
};
