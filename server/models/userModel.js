const pool = require('../config/db')

const createUser = async (name, email, password_hash) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
        [name, email, password_hash]
    )
    return result.rows[0];
}

const getUserByEmail = async (email) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    return result.rows[0];
}

const getUserById = async (id) => {
    const result = await pool.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id])
    return result.rows[0];
}

const updateUser = async (id, name, email) => {
    const result = await pool.query(
        "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at",
        [name, email, id]
    )
    return result.rows[0];
}

const deleteUser = async (id) => {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [id])
    return result.rows[0]
}

module.exports = { getUserByEmail, getUserById, updateUser, deleteUser, createUser }