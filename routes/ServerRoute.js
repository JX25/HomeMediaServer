const express = require('express');
const router = express.Router();
const serverController = require('../controllers/ServerController');

router.get('/test', serverController.test);
router.get('/info', serverController.serverInfo);

module.exports = router;