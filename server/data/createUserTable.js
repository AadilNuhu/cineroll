const pool = require('../config/db')

const createTables = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS movies (
            id VARCHAR(36) PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            year INTEGER,
            poster_url TEXT,
            status VARCHAR(50) DEFAULT 'not_watched' CHECK (status IN ('not_watched', 'watching', 'watched')),
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            notes TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `

    try {
        await pool.query(queryText)
        console.log("Database tables created successfully!")
    } catch (error) {
        console.log("Error creating Tables", error)
    }
}

module.exports = createTables