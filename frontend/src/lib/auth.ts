export interface TokenClaims {
  username?: string;
  user_id?: number | string;
  email?: string;
}

const USERNAME_KEY = "expense_tracker_username";

export function readTokenClaims(): TokenClaims {
  if (typeof window === "undefined") return {};

  const token = window.localStorage.getItem("expense_tracker_access");
  if (!token) return {};

  try {
    const payload = token.split(".")[1];
    if (!payload) return {};

    return JSON.parse(
      window.atob(
        payload.replace(/-/g, "+").replace(/_/g, "/")
      )
    ) as TokenClaims;
  } catch {
    return {};
  }
}

export function saveUsername(username: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(USERNAME_KEY, username);
}

export function getSavedUsername() {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem(USERNAME_KEY) ?? "";
}

export function clearSavedUsername() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(USERNAME_KEY);
}

export function displayName() {
  const savedUsername = getSavedUsername();

  if (savedUsername) {
    return savedUsername;
  }

  const claims = readTokenClaims();

  return claims.username ?? "there";
}