const express = require('express');
const axios = require('axios').default
const log4js = require('log4js')

const router = express.Router();
const logger = log4js.getLogger("routes");
/** @type {import('@opentelemetry/api').Tracer} */
const tracer  = require('../telemetry/tracer')
const { context, setSpan, SpanStatusCode } = require('@opentelemetry/api');
logger.level = "trace";

router.get('/sayHello/:name', async (req,res,next) => {
    const span = tracer.startSpan("Router GET",{},context.active())
    const name = req.params.name;

    try {
        await context.with(setSpan(context.active(),span), async () => {
            const person = await getPerson(name)
            if(!person.data.name) {
                span.end()
                res.status(404).send("The name is not registered on the database.")
            } else {
                const response = await formatGreeting(person.data)
                span.end()
                res.status(response.status).send(response.data)
            }         
        })
    } catch(err) {
        logger.error(err)
        span.addEvent(err)
        span.setAttribute("error",true)
        span.setStatus(SpanStatusCode.ERROR)
        span.end()
        res.status(500).send(err)
    }
})

function getPerson(name) {
    return new Promise((resolve,reject) => {
        const span = tracer.startSpan("getPerson",{},context.active())
        logger.info("Requesting person information")
        context.with(setSpan(context.active(),span), () => {
            axios.get(encodeURI("http://" + process.env.PEOPLE_SERVICE_HOST + "/getPerson/" + name),{
            }).then((response) => {
                span.end()
                resolve(response)
            }).catch((err) => {
                logger.error(err)
                span.addEvent(err.stack)
                span.end()
                reject(err)
            })
        })
    })
}

function formatGreeting(person) {
    return new Promise((resolve,reject) => {
       const span = tracer.startSpan("formatGreeting",{},context.active())
        logger.info("Formatting data")
        context.with(setSpan(context.active(),span), () => {
            axios.get(encodeURI("http://" + process.env.FORMAT_SERVICE_HOST + "/formatGreeting?name=" + person.name + "&description=" + person.description),{
            }).then((response) => {
                span.end()
                resolve(response)
            }).catch((err)=>{
                logger.error(err)
                span.addEvent(err.stack)
                span.setAttribute("error",true)
                span.end()
                reject(err)
            })
        })
    })
}

module.exports = router