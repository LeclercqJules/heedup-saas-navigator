const KEY = "heedup_redirect_after_login";

export function isSafeInternalPath(path: string | null | undefined): path is string {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.includes("//")) return false;
  if (path.toLowerCase().includes("http")) return false;
  return true;
}

export function rememberRedirect(path: string) {
  if (typeof window === "undefined") return;
  if (!isSafeInternalPath(path)) return;
  try {
    window.sessionStorage.setItem(KEY, path);
  } catch {
    /* ignore */
  }
}

export function consumeRedirect(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return isSafeInternalPath(value) ? value : null;
  } catch {
    return null;
  }
}
