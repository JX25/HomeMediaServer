const express = require('express');
const router = express.Router();
const musicController = require('../controllers/MusicController');

router.get('/test', musicController.test);
router.post('/', musicController.create);
router.patch('/upload/:slug', musicController.upload);
router.patch('/upload-thumbnail/:slug', musicController.thumbnail);
router.get('/:slug/detail', musicController.getOne);
router.get('/all', musicController.getAll);
router.get('/stream/:slug', musicController.stream);
router.get('/stream-thumbnail/:slug', musicController.streamThumbnail);
router.put('/:slug', musicController.update);
router.delete('/:slug', musicController.delete);
router.get('/field-unique/:field', musicController.getValueOf);
router.get('/with-age-rate/all', musicController.getAllAgeRate);
router.get('/find/', musicController.filterAll); //?

module.exports = router;