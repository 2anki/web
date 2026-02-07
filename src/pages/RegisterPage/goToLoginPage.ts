export const goToLoginPage = (redirect?: string | null) => {
  const url = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : '/login';
  window.location.href = url;
};
