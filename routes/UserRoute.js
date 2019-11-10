const express = require('express');
const router = express.Router();
const checkAuthAdmin = require('../middleware/IsAdmin');
const checkAuthUser = require('../middleware/IsUser');
const userController = require('../controllers/UserController');

router.get('/test', userController.test);
router.post('/', userController.createUser);
router.get('/nick/:nickname', userController.getUser);
router.patch('/nick/:nickname', userController.updateUser);
router.delete('/nick/:nickname', userController.deleteUser);
router.get('/all', userController.getUsers);
router.patch('/password/:nickname', userController.resetPasswordByAdmin);
router.post('/admin', userController.addAdmin);


module.exports = router;