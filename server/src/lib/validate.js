export function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function trimString(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

export function badRequest(res, message) {
  return res.status(400).json({ error: message });
}
