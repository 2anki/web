const isLoginPage = (path: string) => path.includes('/login');

export const isSimplePage = () => window.location.pathname.endsWith('simple');

export const canShowNavbar = (path: string) =>
  !isLoginPage(path) && !isSimplePage();
