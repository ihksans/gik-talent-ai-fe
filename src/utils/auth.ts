const ACCESS_TOKEN = "talent_ai_token";
const REFRESH_TOKEN = "talent_ai_refresh";
const USER_ID = "talent_ai_user_id";

export function saveSession(
  token: string,
  refreshToken: string,
  userId: string,
) {
  localStorage.setItem(ACCESS_TOKEN, token);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
  localStorage.setItem(USER_ID, userId);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(USER_ID);
}

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}

export function getUserId() {
  return localStorage.getItem(USER_ID);
}

export function isAuthenticated() {
  return !!getToken();
}
