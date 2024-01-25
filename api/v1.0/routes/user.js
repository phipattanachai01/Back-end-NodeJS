const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const functionAuth = require('../middleware/functionAuth');

router.post('/register', UserController.RegisterUser);
router.post('/login', UserController.login);
router.post('/update', UserController.updateUser);
router.delete('/delete', UserController.deleteuse);
router.put('/editpass', UserController.changePasswordByuser);

module.exports = router;
