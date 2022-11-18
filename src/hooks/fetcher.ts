const BASE_API_URL = import.meta.env.VITE_REQUEST_URL;

export async function fetcher(url: string, options: RequestInit = {}) {
  const accessToken = window.localStorage.getItem('access_token');

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  if (options.body) {
    options.headers = {
      ...options.headers,
      'content-type': 'application/json',
    };
  }

  return fetch(BASE_API_URL + url, options);
}
