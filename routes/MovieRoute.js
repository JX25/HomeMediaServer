const express = require('express');
const router = express.Router();
const checkAuthAdmin = require('../middleware/IsAdmin');
const checkAuthUser = require('../middleware/IsUser');
const movieController = require('../controllers/MovieController');

router.get('/test', movieController.test);
router.post('/', movieController.createMovie);
router.patch('/upload/:slug', movieController.uploadMovie);
router.get('/:slug/detail', movieController.getMovie);
router.get('/all', movieController.allMovies);
router.get('/watch/:slug', movieController.streamMovie);
router.put('/:slug/detail', movieController.allMovies);
router.delete('/:slug', movieController.deleteMovie);
router.get('/field-unique/:field', movieController.distinctValues);



module.exports = router;