const { Pool } = require('pg');

// 1. Centralize configuration
const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DB,
    // Add a connection timeout for better error handling
    connectionTimeoutMillis: 2000, 
});

// 2. Self-invoking function to test the connection on startup
(async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully");
        client.release();
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
})();

// 3. Export the pool to use it in other files
module.exports = pool;