const mysql = require('mysql');
const log4js = require('log4js')
const tracer = require('../telemetry/tracer');
const { context, setSpan } = require('@opentelemetry/api');

const logger = log4js.getLogger("repository")
logger.level = "trace"

class Repository {
    constructor(connection) {
        /** @type {import('mysql').Pool}*/
        this.connection = connection;
    }

    getPersons(name) {
        return new Promise((resolve,reject) => {
            const span = tracer.startSpan("Repository: GetPersons",{},context.active())
            context.with(setSpan(context.active(),span), () => {
                this.connection.getConnection((connErr,conn) => {
                    if(connErr){
                        logger.error("An error ocurred: " + connErr)
                        span.setAttribute("error",true)
                        span.addEvent(connErr)
                        span.end()
                        reject(connErr)
                    } else {
                        conn.query(`select name, description from people where name = '${name}'`,(err,res) => {
                            if(err) {
                                logger.error("An error ocurred: " + err)
                                span.setAttribute("error",true)
                                span.addEvent("An error ocurred: " + err)
                                span.end()
                                reject('An error occured getting the user: ' + err);
                            } else {
                                if(res.length === 0) {
                                    span.end()
                                    resolve({});
                                } else {
                                    span.end()
                                    resolve({
                                        name,
                                        description: res[0].description
                                    })
                                }
                            }
                        });
                    }
                })
            })
            
        })
    }
    disconnect() {
        this.connection.end();
    }
}

const handleConnection = () => {
    
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: 'tutorial',
        connectionLimit: 10,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        waitForConnections: true,
    })

    pool.on('acquire', (conn) => {
        logger.debug('Connection %d acquired', conn.threadId);
    });

    pool.on('release', (conn) => {
        logger.debug('Connection %d released', conn.threadId);
    });

    return new Repository(pool)  
}

module.exports = handleConnection()