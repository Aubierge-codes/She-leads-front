const TOKEN_KEY = 'egc_auth_token';
const USER_KEY = 'egc_auth_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

// localStorage changes do not fire "storage" in the tab that made them, so
// same-tab changes announce themselves with this custom event.
export const SESSION_CHANGE_EVENT = 'egc-auth-change';

function announceSessionChange() {
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function setSession(token: string, user: AuthUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  announceSessionChange();
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  announceSessionChange();
}
