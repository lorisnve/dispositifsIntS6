const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../../middleware/authenticateToken');

// public
router.get('/test', userController.hello);
router.post('/register', userController.createUser);
router.post('/login', userController.login);

// private
router.get('/profil', authenticateToken, userController.getUserProfile);
router.post('/add-file', authenticateToken, userController.uploadFile);
router.delete('/rm/:id', authenticateToken, userController.deleteUser);
router.put('/users/ban/:id', authenticateToken, userController.blockUser);
router.get('/users/list', authenticateToken, userController.listUsers);
router.put('/users/up/:id', authenticateToken, userController.upgradeUser);
router.put('/users/down/:id', authenticateToken, userController.downgradeUser);

module.exports = router;
