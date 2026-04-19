import { getBaseURL } from "./getBaseUrl";

export default async function fetchBaseType(name: string) {
  const url = `${getBaseURL()}/templates/${name}.json`;

  const request = await window.fetch(url);

  if (!request.ok) {
    throw new Error(`HTTP error! status: ${request.status}`);
  }

  return await request.json();
}
