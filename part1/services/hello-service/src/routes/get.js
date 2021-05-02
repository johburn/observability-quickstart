const express = require('express');
const axios = require('axios').default
const log4js = require('log4js')

const router = express.Router();
const logger = log4js.getLogger("routes");
logger.level = "trace";

router.get('/sayHello/:name', async (req,res,next) => {
    
    const name = req.params.name;

    try {
        const person = await getPerson(name)
        if(!person.data.name) {
            res.status(404).send("The name is not registered on the database.")
        } else {
        const response = await formatGreeting(person.data)
        res.status(response.status).send(response.data)
        }
    } catch(err) {
        logger.error(err)
        res.status(500).send(err)
    }
})

async function getPerson(name) {
    try {
        logger.info("Requesting person information")
        const response = await axios.get(encodeURI("http://" + process.env.PEOPLE_SERVICE_HOST + "/getPerson/" + name),{
        })
        return response
    } catch(err) {
        logger.error(err)
        throw err
    }
}

async function formatGreeting(person) {
    try {
        logger.info("Formatting data")
        const response = await axios.get(encodeURI("http://" + process.env.FORMAT_SERVICE_HOST + "/formatGreeting?name=" + person.name + "&description=" + person.description),{
        })

        return response
    } catch(err) {
        logger.error(err)
        throw err
    }   
}

module.exports = router