const dao = require('./dao')

function create(publication) {
    return dao.create(publication)//dao.getById() 
}

module.exports = {
    create,
}