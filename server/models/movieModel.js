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
    // Simple last-write-wins sync with ON CONFLICT to avoid duplicate key errors
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const results = [];
        for (const m of movies) {
            const query = `
                INSERT INTO movies (id, user_id, title, year, poster_url, status, rating, notes, is_deleted)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (id) DO UPDATE 
                SET 
                    title = EXCLUDED.title,
                    year = EXCLUDED.year,
                    poster_url = EXCLUDED.poster_url,
                    status = EXCLUDED.status,
                    rating = EXCLUDED.rating,
                    notes = EXCLUDED.notes,
                    is_deleted = EXCLUDED.is_deleted,
                    updated_at = NOW()
                WHERE movies.user_id = EXCLUDED.user_id
                RETURNING *;
            `;
            const values = [
                m.id, 
                user_id, 
                m.title, 
                m.year, 
                m.poster_url, 
                m.status, 
                m.rating, 
                m.notes, 
                m.is_deleted || false
            ];
            const result = await client.query(query, values);
            if (result.rows.length > 0) {
                results.push(result.rows[0]);
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
