const movieModel = require('../models/movieModel')
const { v4: uuidv4 } = require('uuid')

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data })
}

const getMovies = async (req, res, next) => {
    try {
        const movies = await movieModel.getMoviesByUser(req.user.id)
        handleResponse(res, 200, "Movies fetched", movies)
    } catch (error) {
        next(error)
    }
}

const createMovie = async (req, res, next) => {
    try {
        const { id, title, year, poster_url, status, rating, notes } = req.body
        const movieId = id || uuidv4() // Use client ID if provided for offline sync support

        const movie = await movieModel.createMovie(
            movieId, req.user.id, title, year, poster_url, status || 'not_watched', rating, notes
        )
        handleResponse(res, 201, "Movie created", movie)
    } catch (error) {
        next(error)
    }
}

const updateMovie = async (req, res, next) => {
    try {
        const { title, year, poster_url, status, rating, notes } = req.body
        const movie = await movieModel.updateMovie(
            req.params.id, req.user.id, title, year, poster_url, status, rating, notes
        )
        if (!movie) return handleResponse(res, 404, "Movie not found")
        handleResponse(res, 200, "Movie updated", movie)
    } catch (error) {
        next(error)
    }
}

const deleteMovie = async (req, res, next) => {
    try {
        const movie = await movieModel.deleteMovie(req.params.id, req.user.id)
        if (!movie) return handleResponse(res, 404, "Movie not found")
        handleResponse(res, 200, "Movie deleted", { id: req.params.id })
    } catch (error) {
        next(error)
    }
}

const syncMovies = async (req, res, next) => {
    // Received list of movies to sync from the client
    try {
        const { movies } = req.body
        if (!movies || !Array.isArray(movies)) {
            return handleResponse(res, 400, "Invalid movies array")
        }
        await movieModel.syncMovies(req.user.id, movies)

        // Return latest state to client after sync
        const updatedMovies = await movieModel.getMoviesByUser(req.user.id)
        handleResponse(res, 200, "Sync complete", updatedMovies)
    } catch (error) {
        next(error)
    }
}


module.exports = { getMovies, createMovie, updateMovie, deleteMovie, syncMovies }
