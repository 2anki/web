import handleRedirect from '../handleRedirect';
import { NOT_FOUND, UNAUTHORIZED } from './http';

interface ClientSideOptions {
  redirect?: boolean;
}

export const getLoginURL = (baseURL: string) => `${baseURL}users/login`;

export const post = async (url: string, body: unknown) =>
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

export const get = async (
  url: string,
  options: ClientSideOptions = { redirect: true }
) => {
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (options.redirect && handleRedirect(response)) {
    return undefined;
  }

  if (!response.ok) {
    if (response.status === UNAUTHORIZED) {
      window.location.href = '/login';
      return undefined;
    }
    if (response.status === NOT_FOUND) {
      throw new Error(
        `Resource not found: ${response.status} ${response.statusText}`
      );
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`
      );
    }
  }

  return response.json();
};

export const del = async (
  url: string,
  options: ClientSideOptions = { redirect: true }
) => {
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (options.redirect && handleRedirect(response)) {
    return null;
  }
  return response;
};
