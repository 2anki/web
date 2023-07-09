import handleRedirect from '../handleRedirect';
import { OK } from './http';

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
  if (response.status !== OK) {
    throw new Error(response.statusText);
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
