const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/test', userController.test);
router.post('/', userController.create);
router.get('/nick/:nickname', userController.getOne);
router.patch('/nick/:nickname', userController.update);
router.delete('/nick/:nickname', userController.delete);
router.get('/all', userController.getAll);
router.patch('/password/:nickname', userController.ressetPassword);
router.post('/admin', userController.createAdmin);
router.post('/login', userController.login);


module.exports = router;