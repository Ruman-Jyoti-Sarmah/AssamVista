import crypto from "node:crypto";

export const SESSION_COOKIE = "av_session";
export const CSRF_COOKIE = "av_csrf";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
export const SESSION_ROTATE_MS = 1000 * 60 * 60 * 24;

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEYLEN = 64;

export function nowIso() {
  return new Date().toISOString();
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function sanitizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").slice(0, 80);
}

export function validatePassword(password) {
  const value = String(password || "");
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 128) return "Password is too long.";
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return "";
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password, stored) {
  try {
    const [algo, nRaw, rRaw, pRaw, saltRaw, hashRaw] = String(stored || "").split("$");
    if (algo !== "scrypt" || !saltRaw || !hashRaw) return false;
    const salt = Buffer.from(saltRaw, "base64");
    const expected = Buffer.from(hashRaw, "base64");
    const actual = crypto.scryptSync(String(password), salt, expected.length, {
      N: Number(nRaw) || SCRYPT_N,
      r: Number(rRaw) || SCRYPT_R,
      p: Number(pRaw) || SCRYPT_P,
      maxmem: 64 * 1024 * 1024,
    });
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

export function parseCookies(header) {
  const out = {};
  const source = String(header || "");
  if (!source) return out;
  for (const part of source.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(val);
    } catch {
      out[key] = val;
    }
  }
  return out;
}

export function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value ?? "")}`];
  if (options.maxAge != null) parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  parts.push(`Path=${options.path || "/"}`);
  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  return parts.join("; ");
}

export function isSecureRequest(req) {
  if (req.secure) return true;
  const proto = String(req.headers["x-forwarded-proto"] || "").toLowerCase();
  return proto === "https";
}

export function cookieOptions(req, { httpOnly = true, maxAge } = {}) {
  const secure = process.env.NODE_ENV === "production" ? true : isSecureRequest(req);
  return {
    httpOnly,
    secure,
    sameSite: secure ? "None" : "Lax",
    path: "/",
    ...(maxAge != null ? { maxAge } : {}),
  };
}

export function safeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export function createSessionRecord(userId, req) {
  const token = createToken(32);
  const csrfToken = createToken(24);
  const now = Date.now();
  return {
    token,
    csrfToken,
    session: {
      id: `sess-${now}-${createToken(6)}`,
      tokenHash: hashToken(token),
      userId,
      csrfToken,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
      userAgent: String(req.headers["user-agent"] || "").slice(0, 200),
      ip: String(req.ip || req.socket?.remoteAddress || "").slice(0, 80),
    },
  };
}

export function sessionExpired(session) {
  return !session?.expiresAt || new Date(session.expiresAt).getTime() <= Date.now();
}

export function cleanExpiredSessions(db) {
  const before = db.sessions.length;
  db.sessions = db.sessions.filter((s) => !sessionExpired(s));
  return before - db.sessions.length;
}

export function findSession(db, token) {
  if (!token) return null;
  const tokenHash = hashToken(token);
  return db.sessions.find((s) => s.tokenHash === tokenHash) || null;
}
