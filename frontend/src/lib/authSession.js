export const AUTH_SESSION_COOKIE = "cleanline_session";

export function setAuthSessionCookie() {
  document.cookie = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=28800; Secure; SameSite=Lax`;
}

export function clearAuthSessionCookie() {
  document.cookie = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`;
}
