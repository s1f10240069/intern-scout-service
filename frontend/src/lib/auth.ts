export type AuthKind = "student" | "company";

function tokenKey(kind: AuthKind) {
  return kind === "student" ? "studentApiToken" : "companyApiToken";
}

export function saveToken(kind: AuthKind, token: string) {
  localStorage.setItem(tokenKey(kind), token);
  if (kind === "student") localStorage.removeItem("internApiToken");
}

export function getToken(kind: AuthKind): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(tokenKey(kind));
  if (token || kind !== "student") return token;

  const legacyToken = localStorage.getItem("internApiToken");
  if (!legacyToken) return null;

  localStorage.setItem("studentApiToken", legacyToken);
  localStorage.removeItem("internApiToken");
  return legacyToken;
}

export function clearToken(kind: AuthKind) {
  localStorage.removeItem(tokenKey(kind));
  if (kind === "student") localStorage.removeItem("internApiToken");
}
