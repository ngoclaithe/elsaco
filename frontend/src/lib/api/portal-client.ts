const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

let portalRefreshing: Promise<boolean> | null = null;

async function tryPortalRefresh(): Promise<boolean> {
  if (portalRefreshing) return portalRefreshing;

  portalRefreshing = fetch(`${API_URL}/auth/portal/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.ok)
    .finally(() => {
      portalRefreshing = null;
    });

  return portalRefreshing;
}

export async function portalApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && retry && !endpoint.startsWith('/auth/portal')) {
    const ok = await tryPortalRefresh();
    if (ok) return portalApiFetch<T>(endpoint, options, false);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
