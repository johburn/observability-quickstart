const tracer = require('./telemetry/tracer')
const express = require('express');
const log4js = require('log4js')
const getRouter  = require('./routes/get');
const { countActiveRequest,getRequestDuration,registerPromMetrics } = require('./telemetry/metrics')
const { connectLogger } = require('./telemetry/logconfig')

const app = express();
const logger = log4js.getLogger('server')
logger.level = "trace"

app.use(express.json());
app.use(countActiveRequest)
app.use(getRequestDuration)     
app.use('/',getRouter)
app.get('/metrics',registerPromMetrics)
app.listen(process.env.SERVER_PORT, () => {
    logger.info(`Server Ready and Listening to port ${process.env.SERVER_PORT} `)
})
