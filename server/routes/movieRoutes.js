const express = require('express')
const router = express.Router()
const { getMovies, createMovie, updateMovie, deleteMovie, syncMovies } = require('../controller/movieController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect) // All movie routes are protected

router.route('/movies')
    .get(getMovies)
    .post(createMovie)

router.route('/movies/:id')
    .put(updateMovie)
    .delete(deleteMovie)

router.post('/movies/sync', syncMovies)

module.exports = router