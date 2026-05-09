const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const cacheMiddleware = (ttl = 60) => {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `__cache__${req.originalUrl}__user__${req.user?._id || 'anon'}`;
    const cached = cache.get(key);

    if (cached) {
      return res.json({ ...cached, _cached: true });
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      if (res.statusCode === 200) {
        cache.set(key, body, ttl);
      }
      res.sendResponse(body);
    };

    next();
  };
};

const invalidateCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach((key) => {
    if (key.includes(pattern)) cache.del(key);
  });
};

module.exports = { cacheMiddleware, invalidateCache };
