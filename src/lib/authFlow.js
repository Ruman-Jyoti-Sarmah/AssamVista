const PENDING_KEY = "assamvista:auth:pending-action";

export function setPendingAuthAction(action) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(action || null));
  } catch {}
}

export function getPendingAuthAction() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingAuthAction() {
  try { sessionStorage.removeItem(PENDING_KEY); } catch {}
}
