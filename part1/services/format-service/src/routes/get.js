const express = require('express');

    
const router = express.Router();

router.get('/formatGreeting', async (req,res,next) => {
    const name = req.query.name
    const description = req.query.description 
    const response = formatGreeting(name,description)
    res.status(200).send(response)
    })  

function formatGreeting(name, description) {
        let greeting = "Hey! this is "
        if (name) {
            greeting += name + " , here is my message to you: "
        }
        if (description) {
            greeting += description
        }
        return greeting
}

module.exports = router