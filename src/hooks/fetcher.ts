export async function fetcher(url: string, options: RequestInit = {}) {
  const accessToken = window.localStorage.getItem('refresh_token');

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  if (options?.body) {
    options.headers = {
      ...options.headers,
      'content-type': 'application/json',
    };
  }

  const res = await fetch(url, options);
  return res.json();
}
