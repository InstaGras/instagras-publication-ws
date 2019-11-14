const express = require('express')
const app = express()

app.get('/', function (req, res) {
    let msg = { message: "Hello World!" }
    res.send(msg)
})

app.listen(3000, function () {
    console.log('App listening on port 3000!')
})