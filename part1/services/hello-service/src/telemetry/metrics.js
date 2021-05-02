const prom = require('prom-client')
const log4js = require('log4js')

const registry = new prom.Registry()
const logger = log4js.getLogger("metrics");
logger.level = "trace";

prom.collectDefaultMetrics({
    register: registry
})

const request_duration = new prom.Histogram({
    name: "request_duration_ms",
    help: "Request duration histogram",
    labelNames: ["method","path","statuscode"],
    buckets: [0.1, 5, 10, 15, 50, 100, 200, 500]
})

const active_request = new prom.Gauge({
    name: "active_requests_count",
    help: "Count active requests",
    labelNames: ["path"]
})

registry.registerMetric(request_duration)
registry.registerMetric(active_request)

const getRequestDuration = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        request_duration.labels(req.url, req.method, res.statusCode).observe(duration)
    });
    next();
};

const countActiveRequest = (req, res, next) => {
    active_request.inc()
    res.on('finish', () => {
        active_request.dec()
    })
    next();
}

const registerPromMetrics = async (req, res) => {
    console.log('Returning Metrics')
    try {
        res.set('Content-Type', registry.contentType);
        res.end(await registry.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
}

logger.info("Monitoring Initialized")

module.exports = {getRequestDuration, countActiveRequest, registerPromMetrics}