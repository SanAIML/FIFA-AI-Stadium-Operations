const AUTH_STORAGE_KEY = 'fifa_copilot_auth';
const REMEMBER_STORAGE_KEY = 'fifa_copilot_remember';

export const VALID_EMAIL = 'admin@fifa.com';
export const VALID_PASSWORD = 'admin123';

export interface AuthSession {
  email: string;
  loggedInAt: string;
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(`${AUTH_STORAGE_KEY}_session`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function login(email: string, password: string, remember = false): boolean {
  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return false;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  localStorage.setItem(
    `${AUTH_STORAGE_KEY}_session`,
    JSON.stringify({ email, loggedInAt: new Date().toISOString() } satisfies AuthSession)
  );
  localStorage.setItem(REMEMBER_STORAGE_KEY, remember ? email : '');
  return true;
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(`${AUTH_STORAGE_KEY}_session`);
}

export function getRememberedEmail(): string {
  return localStorage.getItem(REMEMBER_STORAGE_KEY) || '';
}
