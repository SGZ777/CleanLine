export const AUTH_SESSION_COOKIE = "cleanline_session";
const AUTH_TOKEN_KEY = "cleanline_token";

export function setAuthSessionCookie() {
  document.cookie = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=28800; SameSite=None; Secure`;
}

export function clearAuthSessionCookie() {
  document.cookie = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=None; Secure`;
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
