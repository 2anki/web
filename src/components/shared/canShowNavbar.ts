const isLoginPage = (path: string) => path.includes('/login');
const isForgotPasswordPage = (path: string) => path.includes('/forgot');
const isRegisterPage = (path: string) => path.includes('/register');

export const canShowNavbar = (path: string) =>
  !isLoginPage(path) && !isForgotPasswordPage(path) && !isRegisterPage(path);
