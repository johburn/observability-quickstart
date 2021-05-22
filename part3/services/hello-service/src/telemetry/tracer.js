const { trace } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const provider = new NodeTracerProvider();
const exporter = new JaegerExporter({ 
    serviceName : process.env.SERVICE_NAME,
    host: process.env.JAEGER_HOST,
    port: process.env.JAEGER_PORT
 });

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register()
registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new HttpInstrumentation({
        ignoreIncomingPaths: [/\/metrics/]
      }),
      new ExpressInstrumentation(),
    ]
})
const tracer = trace.getTracer(process.env.SERVICE_NAME)

module.exports = tracer;