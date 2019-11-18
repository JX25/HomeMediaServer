const express = require('express');
const router = express.Router();
const checkAuthAdmin = require('../middleware/IsAdmin');
const checkAuthUser = require('../middleware/IsUser');
const photoController = require('../controllers/PhotoController');

router.get('/test', photoController.test);
router.post('/', photoController.create);
router.patch('/upload/:slug', photoController.upload);
router.get('/:slug/detail', photoController.getOne);
router.get('/all', photoController.getAll);
router.get('/stream/:slug', photoController.stream);
router.put('/:slug', photoController.update);
router.delete('/:slug', photoController.delete); //?
router.get('/field-unique/:field', photoController.getValueOf);
router.get('/search/', photoController.filterAll);

module.exports = router;