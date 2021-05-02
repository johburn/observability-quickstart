const express = require('express');
const repository = require('../repository/repository')

const router = express.Router();

router.get('/getPerson/:name', async (req,res,next) => {
    
    const name = req.params.name

    repository.getPersons(name).then((person) => {
        if(!person) {
            res.status(404).send('Person not found.');
        } else {
            res.status(200).send(person)
        }
    })
    .catch(next)   
})

module.exports = router