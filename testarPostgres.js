const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: false
});

(async () => {
    try {
        const result = await pool.query('SELECT NOW()');

        console.log("✅ Conectado ao PostgreSQL!");
        console.log(result.rows[0]);

        await pool.end();
    } catch (err) {
        console.error("❌ Erro:");
        console.error(err);
    }
})();