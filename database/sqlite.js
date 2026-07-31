const Database = require('better-sqlite3');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, 'artigos.db');
const db = new Database(dbFile);

db.pragma('journal_mode = WAL');

module.exports = db;