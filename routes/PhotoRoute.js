const express = require('express');
const router = express.Router();
const checkAuthAdmin = require('../middleware/IsAdmin');
const checkAuthUser = require('../middleware/IsUser');
const photoController = require('../controllers/PhotoController');

router.get('/test', photoController.test);
router.post('/', photoController.createPhoto);
router.patch('/upload/:slug', photoController.uploadPhoto);
router.get('/:slug/detail', photoController.getPhoto);
router.get('/all', photoController.allPhotos);
router.get('/watch/:slug', photoController.streamPhoto);
router.put('/:slug/detail', photoController.allPhotos);
router.delete('/:slug', photoController.deletePhoto);
router.get('/field-unique/:field', photoController.distinctValues);
router.get('/find/', photoController.getPhotosWithParameters);

module.exports = router;