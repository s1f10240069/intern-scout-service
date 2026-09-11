export type AuthKind = "intern" | "company";

function tokenKey(kind: AuthKind) {
  return kind === "intern" ? "internApiToken" : "companyApiToken";
}

export function saveToken(kind: AuthKind, token: string) {
  localStorage.setItem(tokenKey(kind), token);
}

export function getToken(kind: AuthKind): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKey(kind));
}

export function clearToken(kind: AuthKind) {
  localStorage.removeItem(tokenKey(kind));
}
