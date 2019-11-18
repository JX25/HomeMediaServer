const express = require('express');
const router = express.Router();
const movieController = require('../controllers/MovieController');

router.get('/test', movieController.test);
router.post('/', movieController.create);
router.patch('/upload/:slug', movieController.upload);
router.get('/:slug/detail', movieController.getOne);
router.get('/all', movieController.getAll);
router.get('/stream/:slug', movieController.stream);
router.put('/:slug', movieController.update);
router.delete('/:slug', movieController.delete);
router.get('/field-unique/:field', movieController.getValueOf);
router.get('/with-age-rate/all', movieController.getAllAgeRate); //dosspr
router.get('/search/', movieController.filterAll); //nie dziala



module.exports = router;