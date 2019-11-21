const service = require('./service')
const express = require('express')
const app = express()
const bodyParser = require("body-parser")

//Express config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.route("/publications")
.post(function (request, response) {
    try {
        response.status(201).json(service.create(request.body))
    } catch(error) {
        response.status(500).json({
            message: error.message
        })
        console.log(error.message)
    }   
    
})

app.listen(3000, function () {
    console.log('App listening on port 3000!')
})