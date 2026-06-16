const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true';
const SESSION_KEY = 'zoomin_editor_token';

const DEV_USER = {
  sub: 'dev-user',
  email: 'dev@local',
  name: 'Developer',
  projectId: 'dev-project',
  brandName: import.meta.env.VITE_BRAND_NAME,
};

function decodeJWTPayload(token) {
  try {
    const [, raw] = token.split('.');
    const padded = raw.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isExpired(payload) {
  return payload.exp != null && payload.exp < Math.floor(Date.now() / 1000);
}

function sanitizeUser(payload) {
  return {
    sub: String(payload.sub ?? ''),
    email: String(payload.email ?? ''),
    name: String(payload.name ?? payload.email ?? ''),
    projectId: payload.projectId ? String(payload.projectId) : undefined,
    brandName: payload.brandName ? String(payload.brandName) : undefined,
  };
}

export function resolveToken() {
  if (DISABLE_AUTH) {
    return { valid: true, user: DEV_USER };
  }

  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');

  if (urlToken) {
    // Remove token from URL bar so it doesn't sit in browser history
    params.delete('token');
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }

  const token = urlToken || sessionStorage.getItem(SESSION_KEY);
  if (!token) return { valid: false, reason: 'No token provided' };

  const payload = decodeJWTPayload(token);
  if (!payload) return { valid: false, reason: 'Malformed token' };
  if (isExpired(payload)) return { valid: false, reason: 'Token has expired' };

  if (urlToken) sessionStorage.setItem(SESSION_KEY, urlToken);

  return { valid: true, user: sanitizeUser(payload) };
}

export function clearToken() {
  sessionStorage.removeItem(SESSION_KEY);
}
