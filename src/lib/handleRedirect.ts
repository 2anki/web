import { AxiosResponse } from 'axios';

function handleRedirect(response: AxiosResponse): void {
  if (response.request.responseURL.includes('login')) {
    window.location.href = '/login#login';
  }
}

export default handleRedirect;
