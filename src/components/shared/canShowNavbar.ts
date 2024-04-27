const isLoginPage = (path: string) => path.includes('/login');
const isForgotPasswordPage = (path: string) => path.includes('/forgot');

export const canShowNavbar = (path: string) =>
  !isLoginPage(path) && !isForgotPasswordPage(path);
