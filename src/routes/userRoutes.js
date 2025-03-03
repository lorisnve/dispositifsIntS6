const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.get('/hey', userController.hey);
router.post('/login', passport.authenticate('local', { session: false }), userController.login);
// router.post('/login', userController.login);
router.post('/calcul', userController.verifyToken, userController.calcul);
router.get('/constante', userController.verifyToken, userController.constante);
router.post('/profil', userController.verifyToken, userController.profil);
router.delete('/delete', userController.verifyToken, userController.verifyAdmin, userController.delete);

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
