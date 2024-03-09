export const isSimplePage = (path: string) => path.endsWith('simple');
const isLoginPage = (path: string) => path.includes('/login');

export const canShowNavbar = (path: string) =>
  !isLoginPage(path) && !isSimplePage(path);
