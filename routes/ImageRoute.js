const express = require('express');
const router = express.Router();
const checkAuthAdmin = require('../middleware/IsAdmin');
const checkAuthUser = require('../middleware/IsUser');
const imageController = require('../controllers/ImageController');

router.get('/test', imageController.test);
router.post('/', imageController.create);
router.patch('/upload/:slug', imageController.upload);
router.get('/:slug/detail', imageController.getOne);
router.get('/all', imageController.getAll);
router.get('/stream/:slug', imageController.stream);
router.get('/stream/image-thumbnail/:slug', imageController.streamThumbnail);
router.put('/:slug', imageController.update);
router.delete('/:slug', imageController.delete); //?
router.get('/field-unique/:field', imageController.getValueOf);
router.get('/with-age-rate/all/:agerate', imageController.getAllAgerate);
router.get('/search/', imageController.filterAll);

module.exports = router;