export const BASE_URL = 'http://127.0.0.1:8000/api';

function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

function storeAccessToken(token: string): void {
  localStorage.setItem('access_token', token);
}

function forceLogout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data: { access: string } = await res.json();
    storeAccessToken(data.access);
    return data.access;
  } catch {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: any = {};
    let message = `Request failed with status ${res.status}`;
    try {
      const text = await res.text();
      try {
        errorBody = JSON.parse(text);
        message = errorBody?.detail ?? errorBody?.message ?? JSON.stringify(errorBody) ?? message;
      } catch {
        // Not JSON — likely a Django HTML traceback
        message = text.slice(0, 300) || message;
        errorBody = { raw: text };
      }
    } catch { /* ignore read errors */ }
    if (import.meta.env.DEV) {
      console.error(`[implementor-api] ${res.status} ${res.url}\n`, 'Error body:', JSON.stringify(errorBody, null, 2));
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const makeRequest = () =>
    fetch(url, { ...options, headers: { ...getAuthHeaders(), ...(options.headers ?? {}) } });

  let res = await makeRequest();

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) { forceLogout(); throw new Error('Session expired. Please log in again.'); }
    res = await makeRequest();
    if (res.status === 401) { forceLogout(); throw new Error('Session expired. Please log in again.'); }
  }

  return res;
}