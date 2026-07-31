const dotenv = require('dotenv');
dotenv.config();

let db;
const client = process.env.DB_CLIENT || 'sqlite';

if (client === 'postgres') {
    console.log("⚠️ Driver Postgres selecionado, mas ainda não implementado.");
} else {
    db = require('./sqlite');
}

module.exports = db;