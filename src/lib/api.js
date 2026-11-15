import { DISTRICTS, slugify } from "@/data/travel/districts.js";
import { DISTRICT_DETAILS } from "@/data/travel/districtDetails.js";
import * as STATIC_CONTENT from "@/data/content.js";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

let csrfToken = null;
export function setClientCsrfToken(token) {
  csrfToken = token || null;
}
export function getClientCsrfToken() {
  return csrfToken;
}

async function request(path, opts = {}) {
  if (!API) throw new ApiError("no-api", 0, null);
  const method = String(opts.method || "GET").toUpperCase();
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && csrfToken && !headers["x-csrf-token"]) {
    headers["x-csrf-token"] = csrfToken;
  }
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...opts,
    method,
    headers,
  });
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }
  if (res.headers.get("x-csrf-token")) csrfToken = res.headers.get("x-csrf-token");
  if (data && typeof data === "object" && data.csrfToken) csrfToken = data.csrfToken;
  if (!res.ok) {
    const message = (data && typeof data === "object" && (data.error || data.message)) || `api-${res.status}`;
    throw new ApiError(String(message), res.status, data);
  }
  return data;
}

const withSlug = (d) => ({ ...d, slug: slugify(d.name) });

export async function fetchDistricts() {
  try {
    const data = await request("/api/districts");
    if (Array.isArray(data) && data.length) return data.map(withSlug);
  } catch {}
  return DISTRICTS.map(withSlug);
}

export async function fetchDistrict(slug) {
  try {
    const data = await request(`/api/districts/${slug}`);
    if (data && data.name) return data;
  } catch {}
  const base = DISTRICTS.find((d) => slugify(d.name) === slug);
  if (!base) return null;
  const det = DISTRICT_DETAILS[slug] || {};
  return {
    ...base,
    slug,
    history: det.history || "",
    attractions: det.attractions || [],
    images: [base.image, ...(det.extra || [])],
    alt: base.alt,
  };
}

export async function fetchContent() {
  try {
    const data = await request("/api/content");
    if (data && data.BRAND) return data;
  } catch {}
  return { ...STATIC_CONTENT };
}

export async function submitBooking(payload) {
  try {
    return await request("/api/bookings", { method: "POST", body: JSON.stringify(payload) });
  } catch (error) {
    if (error instanceof ApiError && error.status && error.status < 500) throw error;
    const key = "assamvista:bookings";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    const rec = { id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString(), pending: true };
    localStorage.setItem(key, JSON.stringify([rec, ...prev]));
    return rec;
  }
}

export async function submitNewsletter(email) {
  try {
    return await request("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
  } catch (error) {
    if (error instanceof ApiError && error.status && error.status < 500) throw error;
    const key = "assamvista:newsletter";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    if (!prev.includes(email)) localStorage.setItem(key, JSON.stringify([email, ...prev]));
    return { ok: true, offline: true };
  }
}

// Auth
export async function authRegister(payload) {
  const data = await request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
  return data;
}
export async function authLogin(payload) {
  const data = await request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
  return data;
}
export async function authLogout() {
  const data = await request("/api/auth/logout", { method: "POST" });
  setClientCsrfToken(null);
  return data;
}
export async function authMe() {
  return request("/api/auth/me");
}
export async function deleteAccount() {
  const data = await request("/api/auth/account", { method: "DELETE" });
  setClientCsrfToken(null);
  return data;
}

// Orders & trip plans
export async function submitOrder(payload) {
  return request("/api/orders", { method: "POST", body: JSON.stringify(payload) });
}
export async function fetchMyOrders() {
  return request("/api/orders/my");
}
export async function submitTripPlan(payload) {
  return request("/api/trip-plans", { method: "POST", body: JSON.stringify(payload) });
}
export async function fetchMyTripPlans() {
  return request("/api/trip-plans/my");
}

export const apiBase = API;
