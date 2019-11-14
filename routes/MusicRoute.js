const express = require('express');
const router = express.Router();
const checkAuthAdmin = require('../middleware/IsAdmin');
const checkAuthUser = require('../middleware/IsUser');
const musicController = require('../controllers/MusicController');

router.get('/test', musicController.test);
router.post('/', musicController.createMusic);
router.patch('/upload/:slug', musicController.uploadMusic);
router.get('/:slug/detail', musicController.getMusic);
router.get('/all', musicController.allMusic);
router.get('/watch/:slug', musicController.streamMusic);
router.put('/:slug/detail', musicController.allMusic);
router.delete('/:slug', musicController.deleteMusic);
router.get('/field-unique/:field', musicController.distinctValues);
router.get('/find/', musicController.getMusicWithParameters);

module.exports = router;