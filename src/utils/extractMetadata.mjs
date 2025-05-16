function extractMeta(req) {
  return {
    ip: req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
    referrer: req.headers['referer'] || req.headers['referrer'] || null,
    hostname: req.hostname || null,
    method: req.method,
    url: req.originalUrl || req.url,
    protocol: req.protocol,
  };
}

// Optional fallback request ID generator
function generateRequestId() {
  return `req-${Math.random().toString(36).substr(2, 9)}`;
}

export default extractMeta
