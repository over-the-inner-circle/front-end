export const BASE_API_URL = import.meta.env.VITE_REQUEST_URL;

export async function fetcher(url: string, options: RequestInit = {}) {
  options = appendAccessToken(options);

  if (options.body) {
    options.headers = {
      ...options.headers,
      'content-type': 'application/json',
    };
  }

  try {
    const res = await fetch(BASE_API_URL + url, options);

    if (!res.ok) throw res;
    return res;
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 401) {
        const refresh = await refreshAccessToken();

        if (refresh) {
          options = appendAccessToken(options);
          return fetch(BASE_API_URL + url, options);
        }
      }
      return error;
    }
    throw error;
  }
}

let isPendingRefreshRequest = false;

async function refreshAccessToken() {
  const refresh_token = window.localStorage.getItem('refresh_token');

  if (!refresh_token || isPendingRefreshRequest) {
    return false;
  }

  isPendingRefreshRequest = true;

  try {
    const res = await fetch(BASE_API_URL + '/auth/refresh', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    });

    if (res.ok) {
      const data = await res.json();

      window.localStorage.setItem('access_token', data.access_token);
      window.localStorage.setItem('refresh_token', data.refresh_token);

      return true;
    }
    throw res;
  } catch {
    return false;
  } finally {
    isPendingRefreshRequest = false;
  }
}

function appendAccessToken(options: RequestInit) {
  const accessToken = window.localStorage.getItem('access_token');

  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return options;
}
