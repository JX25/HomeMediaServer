const express = require('express');
const router = express.Router();
const audioController = require('../controllers/AudioController');

router.get('/test', audioController.test);
router.post('/', audioController.create);
router.patch('/upload/:slug', audioController.upload);
router.patch('/upload-thumbnail/:slug', audioController.thumbnail);
router.get('/:slug/detail', audioController.getOne);
router.get('/all', audioController.getAll);
router.get('/stream/:slug', audioController.stream);
router.get('/stream-thumbnail/:slug', audioController.streamThumbnail);
router.put('/:slug', audioController.update);
router.delete('/:slug', audioController.delete);
router.get('/field-unique/:field', audioController.getValueOf);
router.get('/with-age-rate/all', audioController.getAllAgeRate);
router.get('/find/', audioController.filterAll); //?

module.exports = router;