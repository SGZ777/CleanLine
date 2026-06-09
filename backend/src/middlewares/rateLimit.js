function readPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getClientIp(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

export function createRateLimiter({
  windowMs,
  maxRequests,
  message = 'Muitas requisicoes. Tente novamente mais tarde.',
} = {}) {
  const requests = new Map();
  const configuredWindowMs = readPositiveInt(windowMs, 15 * 60 * 1000);
  const configuredMaxRequests = readPositiveInt(maxRequests, 300);

  const cleanup = setInterval(() => {
    const now = Date.now();

    for (const [key, entry] of requests.entries()) {
      if (entry.resetAt <= now) {
        requests.delete(key);
      }
    }
  }, configuredWindowMs);

  cleanup.unref?.();

  return function rateLimiter(req, res, next) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const key = getClientIp(req);
    const now = Date.now();
    const current = requests.get(key);
    const entry = current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + configuredWindowMs };

    entry.count += 1;
    requests.set(key, entry);

    const remaining = Math.max(configuredMaxRequests - entry.count, 0);
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);

    res.setHeader('RateLimit-Limit', configuredMaxRequests);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetInSeconds);

    if (entry.count > configuredMaxRequests) {
      res.setHeader('Retry-After', resetInSeconds);

      return res.status(429).json({
        error: message,
        retryAfter: resetInSeconds,
      });
    }

    return next();
  };
}
