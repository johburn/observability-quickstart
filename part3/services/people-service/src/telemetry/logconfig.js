const log4js = require('log4js')

log4js.configure({
    appenders: {
        file: {
            type: 'file',
            layout: {
              type: 'pattern',
              pattern: '%d %h %f:%l (%z) %p %c - %m %s',          
            },
            filename: process.env.LOG_FILE_NAME,
            maxLogSize: 10 * 1024 * 1024,
            compress: true, 
            encoding: 'utf-8',
            mode: 0o0640,
            flags: 'w+'
          },
          console: {
            type: 'console'
          }
    },
    categories: {
        default:  { appenders: ['file', 'console'], level: 'trace', enableCallStack: true }
    }
})

const connectLogger =  (logger) => log4js.connectLogger(logger, {
    level: 'auto',
    nolog: ['/metrics', '/favicon.ico'],
    format: (req, res, format) => format(`:remote-addr - traceID=${req.traceId} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
})

module.exports = { connectLogger }