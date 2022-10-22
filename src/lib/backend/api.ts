export const getLoginURL = (baseURL: string) => `${baseURL}users/login`;

export const post = async (url: string, body: unknown) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response;
};

export const get = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include'
  });
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
};
