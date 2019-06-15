const mysql = require('mysql2');

// Don't steal my Password please :).
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'learning_node',
    password: 'rootroot'
})

module.exports = pool.promise();