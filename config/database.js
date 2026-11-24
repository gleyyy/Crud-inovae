
const mysql = require('mysql');

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'locadora_roupas',
    connectionLimit: 5
});

module.exports = conn;
