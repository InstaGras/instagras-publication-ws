require('dotenv').config({ path: './.env' })

//Using a Pool is more efficient than a Client because it provides a pool of reusable Client instances
const { Pool } = require('pg')

const pool = new Pool({
    user: process.env['client.user'],
    host: process.env['client.host'],
    database: process.env['client.database'],
    password: process.env['client.password'],
    port: process.env['client.port'],
})

const tableName = "\"publication\".\"publication\""

function create(publication) {
    const query = "insert into %1 (description, username, creation_date, content_id) values (%2, %3, %4, %5);" 
    pool.query(query, [tableName, publication.description, publication.username, publication.creation_date, publication.content_id], (error, result) => {
        if (error) {
            throw error
        } else {
            return result.insertId
        }  
    })
}

// function getById(id) {
//     const query = "select * from %1 where id = %2"

//     pool.query(query, [tableName, id], (error, result) => {
//         if (error) {
//             throw error
//         } else {
//             publication = {new }
//             return results.insertId
//         }
//     })
// }

module.exports = {
    create,
}