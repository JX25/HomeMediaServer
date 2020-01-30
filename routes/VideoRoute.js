const express = require('express');
const router = express.Router();
const videoController = require('../controllers/VideoController');

router.get('/test', videoController.test);
router.post('/', videoController.create);
router.patch('/upload/:slug', videoController.upload);
router.patch('/upload-thumbnail/:slug', videoController.thumbnail);
router.get('/:slug/detail', videoController.getOne);
router.get('/all', videoController.getAll);
router.get('/stream/:slug', videoController.stream);
router.get('/stream-thumbnail/:slug', videoController.streamThumbnail);
router.put('/:slug', videoController.update);
router.delete('/:slug', videoController.delete);
router.get('/field-unique/:field', videoController.getValueOf);
router.get('/with-age-rate/all', videoController.getAllAgeRate); //dosspr
router.get('/search/', videoController.filterAll); //nie dziala



module.exports = router;