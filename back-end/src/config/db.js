const mysql = require('mysql2');
require('dotenv').config();

// Criamos um "pool" de conexões para melhor performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '172sapoetec',
    database: process.env.DB_NAME || 'vivabem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportamos a versão que permite usar async/await
module.exports = pool.promise();