const pool = require('../config/db')

const createMovie = async (id, user_id, title, year, poster_url, status, rating, notes) => {
    const result = await pool.query(
        `INSERT INTO movies (id, user_id, title, year, poster_url, status, rating, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [id, user_id, title, year, poster_url, status, rating, notes]
    )
    return result.rows[0];
}

const getMoviesByUser = async (user_id) => {
    const result = await pool.query(
        `SELECT * FROM movies WHERE user_id = $1 AND is_deleted = FALSE`,
        [user_id]
    )
    return result.rows;
}

const updateMovie = async (id, user_id, title, year, poster_url, status, rating, notes) => {
    const result = await pool.query(
        `UPDATE movies
         SET title=$1, year=$2, poster_url=$3, status=$4, rating=$5, notes=$6, updated_at=NOW()
         WHERE id=$7 AND user_id=$8 AND is_deleted = FALSE RETURNING *`,
        [title, year, poster_url, status, rating, notes, id, user_id]
    )
    return result.rows[0];
}

const deleteMovie = async (id, user_id) => {
    // Soft delete to help with offline sync if needed, but normally just update is_deleted
    const result = await pool.query(
        `UPDATE movies SET is_deleted = TRUE, updated_at = NOW() WHERE id=$1 AND user_id=$2 RETURNING *`,
        [id, user_id]
    )
    return result.rows[0];
}

const syncMovies = async (user_id, movies) => {
    // Simple last-write-wins sync
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const results = [];
        for (const m of movies) {
            // Check if exists
            const existing = await client.query('SELECT * FROM movies WHERE id=$1 AND user_id=$2', [m.id, user_id])

            if (existing.rows.length > 0) {
                // Update
                if (m.is_deleted) {
                    await client.query('UPDATE movies SET is_deleted=TRUE, updated_at=NOW() WHERE id=$1', [m.id])
                } else {
                    const updated = await client.query(
                        `UPDATE movies
                         SET title=$1, year=$2, poster_url=$3, status=$4, rating=$5, notes=$6, updated_at=NOW()
                         WHERE id=$7 AND user_id=$8 RETURNING *`,
                        [m.title, m.year, m.poster_url, m.status, m.rating, m.notes, m.id, user_id]
                    )
                    results.push(updated.rows[0])
                }
            } else if (!m.is_deleted) {
                // Insert
                const inserted = await client.query(
                    `INSERT INTO movies (id, user_id, title, year, poster_url, status, rating, notes)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                    [m.id, user_id, m.title, m.year, m.poster_url, m.status, m.rating, m.notes]
                )
                results.push(inserted.rows[0])
            }
        }

        await client.query('COMMIT')
        return results;
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}

module.exports = { createMovie, getMoviesByUser, updateMovie, deleteMovie, syncMovies }
