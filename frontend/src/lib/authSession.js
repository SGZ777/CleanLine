export const AUTH_SESSION_COOKIE = "cleanline_session";
const AUTH_TOKEN_KEY = "cleanline_token";

export function setAuthSessionCookie() {
  const isProd = window.location.protocol === 'https:';
  const cookieBase = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=28800; SameSite=Lax`;
  document.cookie = isProd ? `${cookieBase}; Secure` : cookieBase;
}

export function clearAuthSessionCookie() {
  const isProd = window.location.protocol === 'https:';
  const cookieBase = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = isProd ? `${cookieBase}; Secure` : cookieBase;
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function setAuthSession(token) {
  setAuthSessionCookie();

  if (token) {
    setAuthToken(token);
  }
}

export function clearAuthSession() {
  clearAuthSessionCookie();
  clearAuthToken();
}
