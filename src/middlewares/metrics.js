'use strict';

const client = require('prom-client');
const register = new client.Registry();

// Default metrics like CPU, memory, etc.
client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 2, 5],
});
register.registerMetric(httpRequestDurationMicroseconds);

const slowRequests = new client.Histogram({
  name: 'slow_api_requests',
  help: 'Slow API requests over time',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [1, 2, 3, 5, 10],
});
register.registerMetric(slowRequests);

const errorCounter = new client.Counter({
  name: 'api_errors_total',
  help: 'Total number of API errors',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(errorCounter);

const requestSizeHistogram = new client.Histogram({
  name: 'request_payload_size_bytes',
  help: 'Size of incoming request payloads',
  labelNames: ['method', 'route'],
  buckets: [500, 1000, 5000, 10000, 50000],
});
register.registerMetric(requestSizeHistogram);

const activeRequests = new client.Gauge({
  name: 'active_requests',
  help: 'Number of in-progress HTTP requests',
});
register.registerMetric(activeRequests);

// ✅ EXPORT AS A FACTORY FUNCTION
module.exports = () => {
  return async (ctx, next) => {
    // Expose /metrics
    if (ctx.request.path === '/metrics') {
      ctx.set('Content-Type', register.contentType);
      ctx.body = await register.metrics();
      return;
    }

    const start = process.hrtime();
    const route = ctx._matchedRoute || ctx.request.path;

    activeRequests.inc();
    await next();
    activeRequests.dec();

    const diff = process.hrtime(start);
    const responseTimeInSeconds = diff[0] + diff[1] / 1e9;

    httpRequestDurationMicroseconds
      .labels(ctx.method, route, ctx.status.toString())
      .observe(responseTimeInSeconds);

    if (responseTimeInSeconds > 1) {
      slowRequests
        .labels(ctx.method, route, ctx.status.toString())
        .observe(responseTimeInSeconds);
    }

    if (ctx.status >= 400) {
      errorCounter
        .labels(ctx.method, route, ctx.status.toString())
        .inc();
    }

    const contentLength = parseInt(ctx.request.headers['content-length'] || '0');
    requestSizeHistogram.labels(ctx.method, route).observe(contentLength);
  };
};
