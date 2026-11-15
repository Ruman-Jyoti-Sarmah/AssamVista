const buckets = new Map();

function now() {
  return Date.now();
}

function prune(key, windowMs) {
  const arr = buckets.get(key) || [];
  const cutoff = now() - windowMs;
  const fresh = arr.filter((ts) => ts > cutoff);
  if (fresh.length) buckets.set(key, fresh);
  else buckets.delete(key);
  return fresh;
}

export function createRateLimiter({ windowMs, max, keyPrefix = "rl" }) {
  return (req, res, next) => {
    const ip = String(req.ip || req.socket?.remoteAddress || "unknown");
    const key = `${keyPrefix}:${ip}`;
    const hits = prune(key, windowMs);
    if (hits.length >= max) {
      const retryAfter = Math.ceil((hits[0] + windowMs - now()) / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retryAfter)));
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
    hits.push(now());
    buckets.set(key, hits);
    return next();
  };
}
