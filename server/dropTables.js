const pool = require('./config/db');

async function dropTables() {
    try {
        await pool.query('DROP TABLE IF EXISTS movies CASCADE;');
        await pool.query('DROP TABLE IF EXISTS users CASCADE;');
        console.log('Tables dropped!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
dropTables();
