const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Keki250594.',
    port: 3306,
    database: 'memorys'
});
module.exports = pool.promise();

