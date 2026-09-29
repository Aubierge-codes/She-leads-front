'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { getToken, getUser, SESSION_CHANGE_EVENT, type AuthUser } from './auth';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange); // other tabs signing in/out
  window.addEventListener(SESSION_CHANGE_EVENT, onChange); // this tab
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(SESSION_CHANGE_EVENT, onChange);
  };
}

const noopSubscribe = () => () => {};

/**
 * The signed-in session, read from the browser without causing a hydration
 * mismatch. The server (and the first client render) always report
 * `hydrated: false`; only after hydration do real values appear.
 */
export function useSession(): { hydrated: boolean; token: string | null; user: AuthUser | null } {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  // A string snapshot keeps identity stable between renders; parse it once.
  const rawUser = useSyncExternalStore(
    subscribe,
    () => (getToken() ? JSON.stringify(getUser()) : null),
    () => null,
  );
  const user = useMemo<AuthUser | null>(() => (rawUser ? (JSON.parse(rawUser) as AuthUser | null) : null), [rawUser]);

  return { hydrated, token, user };
}
