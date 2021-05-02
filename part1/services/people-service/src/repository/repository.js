const mysql = require('mysql');
const log4js = require('log4js')

const logger = log4js.getLogger("repository")
logger.level = "trace"

class Repository {
    constructor(connection) {
        this.connection = connection;
    }

    getPersons(name) {
        return new Promise((resolve,reject) => {
            this.connection.query(`select name, description from people where name = '${name}'`,(err,res) => {
                if(err) {
                    logger.error("An error ocurred: " + err)
                    return reject(new Error('An error occured getting the user: ' + err));
                }

                if(res.length === 0) {
                    resolve({});
                } else {
                    resolve({
                        name,
                        description: res[0].description
                    })
                }
            });
        })
    }
    disconnect() {
        this.connection.end();
    }
}

const handleConnection = () => {
    
    const mysqlConn = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: 'tutorial'
    })

    mysqlConn.connect((err) => {
        if(err) {
            logger.error(err)
            throw err;
        }
        logger.info("Connected to database")
    })
    
    return new Repository(mysqlConn)  
}

module.exports = handleConnection()