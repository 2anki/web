const isLoginPage = (path: string) => path.includes('/login');
const isForgotPasswordPage = (path: string) => path.includes('/forgot');

export const isSimplePage = () => window.location.pathname.endsWith('simple');

export const canShowNavbar = (path: string) =>
  !isLoginPage(path) && !isSimplePage() && !isForgotPasswordPage(path);
