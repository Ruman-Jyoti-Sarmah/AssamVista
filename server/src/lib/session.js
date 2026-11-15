import { updateDb, readDb } from "./db.js";
import {
  SESSION_COOKIE,
  CSRF_COOKIE,
  SESSION_TTL_MS,
  SESSION_ROTATE_MS,
  parseCookies,
  cookieOptions,
  serializeCookie,
  createSessionRecord,
  findSession,
  sessionExpired,
  cleanExpiredSessions,
  safeUser,
  hashToken,
} from "./auth.js";

function setCookie(res, cookie) {
  const prev = res.getHeader("Set-Cookie");
  if (!prev) res.setHeader("Set-Cookie", cookie);
  else if (Array.isArray(prev)) res.setHeader("Set-Cookie", [...prev, cookie]);
  else res.setHeader("Set-Cookie", [prev, cookie]);
}

export function setAuthCookies(req, res, token, csrfToken) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  setCookie(res, serializeCookie(SESSION_COOKIE, token, { ...cookieOptions(req, { httpOnly: true }), maxAge }));
  setCookie(res, serializeCookie(CSRF_COOKIE, csrfToken, { ...cookieOptions(req, { httpOnly: false }), maxAge }));
}

export function clearAuthCookies(req, res) {
  const base = cookieOptions(req, { httpOnly: true });
  const basePub = cookieOptions(req, { httpOnly: false });
  setCookie(res, serializeCookie(SESSION_COOKIE, "", { ...base, maxAge: 0 }));
  setCookie(res, serializeCookie(CSRF_COOKIE, "", { ...basePub, maxAge: 0 }));
}

export async function createAuthSession(req, res, userId) {
  const { token, csrfToken, session } = createSessionRecord(userId, req);
  await updateDb((db) => {
    cleanExpiredSessions(db);
    db.sessions.push(session);
  });
  setAuthCookies(req, res, token, csrfToken);
  return { token, csrfToken, sessionId: session.id };
}

async function rotateSession(req, res, current) {
  const rotated = createSessionRecord(current.userId, req);
  rotated.session.createdAt = current.createdAt || rotated.session.createdAt;
  await updateDb((db) => {
    cleanExpiredSessions(db);
    db.sessions = db.sessions.filter((s) => s.tokenHash !== current.tokenHash);
    db.sessions.push(rotated.session);
  });
  setAuthCookies(req, res, rotated.token, rotated.csrfToken);
  return rotated.session;
}

export async function resolveAuth(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const db = await readDb();
  cleanExpiredSessions(db);
  let session = findSession(db, token);
  if (!session || sessionExpired(session)) {
    if (session) {
      await updateDb((d) => {
        d.sessions = d.sessions.filter((s) => s.tokenHash !== session.tokenHash);
      });
      clearAuthCookies(req, res);
    }
    return null;
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    await updateDb((d) => {
      d.sessions = d.sessions.filter((s) => s.tokenHash !== session.tokenHash);
    });
    clearAuthCookies(req, res);
    return null;
  }

  // Rotate old sessions opportunistically and keep metadata fresh.
  const ageMs = Date.now() - new Date(session.updatedAt || session.createdAt || 0).getTime();
  if (ageMs > SESSION_ROTATE_MS) {
    session = await rotateSession(req, res, session);
  } else {
    await updateDb((d) => {
      const s = d.sessions.find((x) => x.tokenHash === session.tokenHash);
      if (s) {
        s.updatedAt = new Date().toISOString();
        s.userAgent = String(req.headers["user-agent"] || s.userAgent || "").slice(0, 200);
        s.ip = String(req.ip || req.socket?.remoteAddress || s.ip || "").slice(0, 80);
      }
    });
  }

  return { user, session, csrfToken: session.csrfToken || cookies[CSRF_COOKIE] || "" };
}

export async function attachAuth(req, _res, next) {
  try {
    const auth = await resolveAuth(req, _res).catch(() => null);
    req.auth = auth;
    req.user = auth?.user || null;
    req.session = auth?.session || null;
    next();
  } catch {
    req.auth = null;
    req.user = null;
    req.session = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user || !req.session) {
    return res.status(401).json({ error: "Authentication required." });
  }
  return next();
}

export function requireCsrf(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies[CSRF_COOKIE];
  const headerToken = String(req.headers["x-csrf-token"] || "");
  const expected = req.session?.csrfToken || cookieToken || "";
  if (!expected || !headerToken || headerToken !== expected) {
    return res.status(403).json({ error: "Invalid CSRF token." });
  }
  return next();
}

export async function destroyCurrentSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (token) {
    const tokenHash = hashToken(token);
    await updateDb((db) => {
      db.sessions = db.sessions.filter((s) => s.tokenHash !== tokenHash);
    });
  }
  clearAuthCookies(req, res);
}

export function publicUser(user) {
  return safeUser(user);
}
