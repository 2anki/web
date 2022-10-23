function handleRedirect(response: Response): void {
  if (response.url.includes('login')) {
    window.location.href = '/login#login';
  }
}

export default handleRedirect;
