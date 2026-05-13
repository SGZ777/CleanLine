export const AUTH_SESSION_COOKIE = "cleanline_session";

function getCookieSecurityAttribute() {
  return window.location.protocol === "https:" ? "; Secure" : "";
}

export function setAuthSessionCookie() {
  document.cookie = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=28800; SameSite=Lax${getCookieSecurityAttribute()}`;
}

export function clearAuthSessionCookie() {
  document.cookie = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${getCookieSecurityAttribute()}`;
}
