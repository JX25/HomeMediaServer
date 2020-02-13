const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/test', userController.test);
router.post('/', userController.create);
router.get('/login/:nickname', userController.getOne);
router.patch('/login/:nickname/:isAdmin', userController.update);
router.delete('/login/:nickname/:isAdmin', userController.delete);
router.get('/all', userController.getAll);
router.get('/all/admins', userController.getAllAdmins);
router.patch('/password/:nickname', userController.resetPassword);
router.post('/admin', userController.createAdmin);
router.post('/login', userController.login);

module.exports = router;