import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDb, updateDb } from "./lib/db.js";
import { createRateLimiter } from "./lib/rateLimit.js";
import { badRequest } from "./lib/validate.js";
import { buildServerOrderItems, validateCustomer } from "./lib/catalog.js";
import {
  nowIso,
  normalizeEmail,
  isValidEmail,
  sanitizeName,
  validatePassword,
  hashPassword,
  verifyPassword,
  createToken,
  safeUser,
  SESSION_TTL_MS,
  isSecureRequest,
} from "./lib/auth.js";
import {
  attachAuth,
  requireAuth,
  requireCsrf,
  createAuthSession,
  destroyCurrentSession,
  publicUser,
  clearAuthCookies,
} from "./lib/session.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_KEY = process.env.ADMIN_KEY || "";
if (process.env.NODE_ENV === "production" && !ADMIN_KEY) {
  throw new Error("ADMIN_KEY must be set in production.");
}
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "http://localhost:5173").replace(/\/$/, "");

const slugify = (name) =>
  String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      const allowed = new Set([CLIENT_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"]);
      if (allowed.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(attachAuth);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production" && isSecureRequest(req)) {
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }
  next();
});

const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: "auth" });
const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "login" });
const writeLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 60, keyPrefix: "write" });

// ---------- public API ----------
app.get("/api/health", (_, res) => res.json({ ok: true, time: nowIso() }));

app.get("/api/districts", async (_req, res, next) => {
  try {
    const { districts } = await readDb();
    res.json((districts || []).map((d) => ({ ...d, slug: slugify(d.name) })));
  } catch (e) { next(e); }
});

app.get("/api/districts/:slug", async (req, res, next) => {
  try {
    const { districts } = await readDb();
    const list = districts || [];
    const d = list.find((x) => slugify(x.name) === req.params.slug);
    if (!d) return res.status(404).json({ error: "not-found" });
    const i = list.indexOf(d);
    res.json({
      ...d,
      slug: req.params.slug,
      prev: i > 0 ? slugify(list[i - 1].name) : null,
      next: i < list.length - 1 ? slugify(list[i + 1].name) : null,
    });
  } catch (e) { next(e); }
});

app.get("/api/content", async (_req, res, next) => {
  try {
    const { content } = await readDb();
    res.json(content || {});
  } catch (e) { next(e); }
});

// Preserve public visit booking endpoint (guest enquiries)
app.post("/api/bookings", writeLimiter, async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = String(body.name || "").trim().slice(0, 80);
    const email = normalizeEmail(body.email);
    const date = String(body.date || "").trim().slice(0, 20);
    if (!name || !email || !date) return badRequest(res, "name, email, date required");
    if (!isValidEmail(email)) return badRequest(res, "invalid email");
    const rec = {
      id: `b-${Date.now()}-${createToken(4)}`,
      name,
      email,
      date,
      guests: String(body.guests || "").trim().slice(0, 20),
      district: String(body.district || "").trim().slice(0, 80),
      message: String(body.message || "").trim().slice(0, 1000),
      createdAt: nowIso(),
    };
    await updateDb((db) => { db.bookings.unshift(rec); });
    res.status(201).json(rec);
  } catch (e) { next(e); }
});

app.post("/api/newsletter", writeLimiter, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email || !isValidEmail(email)) return badRequest(res, "invalid email");
    await updateDb((db) => {
      if (!db.newsletter.includes(email)) db.newsletter.unshift(email);
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---------- authentication ----------
app.post("/api/auth/register", authLimiter, async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = sanitizeName(body.name);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    if (name.length < 2) return badRequest(res, "Name is required.");
    if (!isValidEmail(email)) return badRequest(res, "A valid email address is required.");
    const pwError = validatePassword(password);
    if (pwError) return badRequest(res, pwError);

    const created = await updateDb((db) => {
      if (db.users.some((u) => normalizeEmail(u.email) === email)) {
        return { conflict: true };
      }
      const user = {
        id: `u-${Date.now()}-${createToken(5)}`,
        name,
        email,
        passwordHash: hashPassword(password),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db.users.push(user);
      return { user };
    });

    if (created?.conflict) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    await createAuthSession(req, res, created.user.id);
    res.status(201).json({ user: publicUser(created.user) });
  } catch (e) { next(e); }
});

app.post("/api/auth/login", loginLimiter, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!isValidEmail(email) || !password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const db = await readDb();
    const user = db.users.find((u) => normalizeEmail(u.email) === email);
    const ok = user && verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password." });

    await createAuthSession(req, res, user.id);
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

app.post("/api/auth/logout", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    await destroyCurrentSession(req, res);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.get("/api/auth/me", async (req, res) => {
  if (!req.user) {
    clearAuthCookies(req, res);
    return res.status(401).json({ user: null });
  }
  res.json({ user: publicUser(req.user), csrfToken: req.session?.csrfToken || null });
});

app.delete("/api/auth/account", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const userId = req.user.id;
    await updateDb((db) => {
      db.users = db.users.filter((u) => u.id !== userId);
      db.sessions = db.sessions.filter((s) => s.userId !== userId);
      db.orders = db.orders.filter((o) => o.userId !== userId);
      db.tripPlans = db.tripPlans.filter((p) => p.userId !== userId);
    });
    clearAuthCookies(req, res);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---------- authenticated commerce/trip APIs ----------
app.post("/api/orders", requireAuth, requireCsrf, writeLimiter, async (req, res, next) => {
  try {
    const body = req.body || {};
    const built = buildServerOrderItems(body.items);
    if (built.error) return badRequest(res, built.error);
    const validated = validateCustomer(body.customer);
    if (validated.error) return badRequest(res, validated.error);
    const clientRequestId = String(body.clientRequestId || "").trim().slice(0, 80);

    const result = await updateDb((db) => {
      if (clientRequestId) {
        const existing = db.orders.find(
          (o) => o.userId === req.user.id && o.clientRequestId === clientRequestId
        );
        if (existing) return { existing };
      }
      const order = {
        id: `ord-${Date.now()}-${createToken(4)}`,
        userId: req.user.id,
        clientRequestId: clientRequestId || null,
        status: "placed",
        paymentStatus: "pending",
        fulfillmentStatus: "unfulfilled",
        placedAt: nowIso(),
        items: built.items,
        subtotal: built.subtotal,
        shipping: built.shipping,
        total: built.total,
        currency: built.currency,
        customer: validated.customer,
        note: "Order request recorded. No online payment is processed by this implementation.",
      };
      db.orders.unshift(order);
      return { order, created: true };
    });

    if (result.existing) return res.status(200).json({ order: result.existing, duplicate: true });
    return res.status(201).json({ order: result.order });
  } catch (e) { next(e); }
});

app.get("/api/orders/my", requireAuth, async (req, res, next) => {
  try {
    const db = await readDb();
    const orders = (db.orders || []).filter((o) => o.userId === req.user.id);
    res.json({ orders });
  } catch (e) { next(e); }
});

app.post("/api/trip-plans", requireAuth, requireCsrf, writeLimiter, async (req, res, next) => {
  try {
    const body = req.body || {};
    const selectedIds = Array.isArray(body.destinations || body.selectedIds) ? (body.destinations || body.selectedIds).map(String).filter(Boolean).slice(0, 60) : [];
    const details = body.details && typeof body.details === "object" ? body.details : {};
    const itinerary = body.itinerary && typeof body.itinerary === "object" ? body.itinerary : null;
    if (!selectedIds.length) return badRequest(res, "Select at least one destination.");
    if (!details.arrivalDate) return badRequest(res, "Arrival date is required.");
    if (!itinerary || !Array.isArray(itinerary.days) || !itinerary.days.length) {
      return badRequest(res, "A generated itinerary is required to submit your trip plan.");
    }
    const clientRequestId = String(body.clientRequestId || "").trim().slice(0, 80);

    const result = await updateDb((db) => {
      if (clientRequestId) {
        const existing = db.tripPlans.find(
          (p) => p.userId === req.user.id && p.clientRequestId === clientRequestId
        );
        if (existing) return { existing };
      }
      const plan = {
        id: `tp-${Date.now()}-${createToken(4)}`,
        userId: req.user.id,
        clientRequestId: clientRequestId || null,
        status: "submitted",
        submittedAt: nowIso(),
        destinations: selectedIds,
        details: {
          arrivalDate: String(details.arrivalDate || "").slice(0, 20),
          departureDate: String(details.departureDate || "").slice(0, 20),
          startLocation: String(details.startLocation || "").slice(0, 120),
          arrivalTime: String(details.arrivalTime || "").slice(0, 20),
          departureTime: String(details.departureTime || "").slice(0, 20),
          adults: Math.max(0, Number(details.adults || 0) || 0),
          children: Math.max(0, Number(details.children || 0) || 0),
          travelStyle: String(details.travelStyle || "").slice(0, 40),
          accessibility: String(details.accessibility || "").slice(0, 300),
          budget: String(details.budget || "").slice(0, 40),
          budgetCategory: String(details.budgetCategory || "").slice(0, 40),
          transport: String(details.transport || "").slice(0, 40),
          accommodation: String(details.accommodation || "").slice(0, 40),
          interests: Array.isArray(details.interests) ? details.interests.map(String).slice(0, 30) : [],
          notes: String(details.notes || "").slice(0, 1000),
        },
        itinerary,
      };
      db.tripPlans.unshift(plan);
      return { plan, created: true };
    });

    if (result.existing) return res.status(200).json({ plan: result.existing, duplicate: true });
    return res.status(201).json({ plan: result.plan });
  } catch (e) { next(e); }
});

app.get("/api/trip-plans/my", requireAuth, async (req, res, next) => {
  try {
    const db = await readDb();
    const plans = (db.tripPlans || []).filter((p) => p.userId === req.user.id);
    res.json({ plans });
  } catch (e) { next(e); }
});

// ---------- admin (header: x-admin-key) ----------
const admin = (req, res, next) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY)
    return res.status(401).json({ error: "unauthorized — send x-admin-key header" });
  next();
};

app.get("/api/admin/bookings", admin, async (_req, res, next) => {
  try { res.json((await readDb()).bookings || []); } catch (e) { next(e); }
});
app.get("/api/admin/newsletter", admin, async (_req, res, next) => {
  try { res.json((await readDb()).newsletter || []); } catch (e) { next(e); }
});
app.get("/api/admin/orders", admin, async (_req, res, next) => {
  try { res.json((await readDb()).orders || []); } catch (e) { next(e); }
});
app.get("/api/admin/trip-plans", admin, async (_req, res, next) => {
  try { res.json((await readDb()).tripPlans || []); } catch (e) { next(e); }
});

app.post("/api/admin/districts", admin, async (req, res, next) => {
  try {
    let rec;
    await updateDb((db) => {
      rec = { no: (db.districts?.length || 0) + 1, ...req.body };
      db.districts.push(rec);
    });
    res.status(201).json(rec);
  } catch (e) { next(e); }
});

app.put("/api/admin/districts/:slug", admin, async (req, res, next) => {
  try {
    let updated = null;
    await updateDb((db) => {
      const i = db.districts.findIndex((x) => slugify(x.name) === req.params.slug);
      if (i < 0) return;
      db.districts[i] = { ...db.districts[i], ...req.body };
      updated = db.districts[i];
    });
    if (!updated) return res.status(404).json({ error: "not-found" });
    res.json(updated);
  } catch (e) { next(e); }
});

app.delete("/api/admin/districts/:slug", admin, async (req, res, next) => {
  try {
    let found = false;
    await updateDb((db) => {
      const n = db.districts.length;
      db.districts = db.districts.filter((x) => slugify(x.name) !== req.params.slug);
      found = db.districts.length !== n;
    });
    if (!found) return res.status(404).json({ error: "not-found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.delete("/api/admin/bookings/:id", admin, async (req, res, next) => {
  try {
    await updateDb((db) => {
      db.bookings = (db.bookings || []).filter((b) => b.id !== req.params.id);
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.use((err, _req, res, _next) => {
  if (String(err?.message || "").includes("CORS")) {
    return res.status(403).json({ error: "Origin not allowed." });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

export function startServer(port = process.env.PORT || 4000) {
  return app.listen(port, () => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`AssamVista API on http://localhost:${port}`);
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  startServer();
}

export default app;
