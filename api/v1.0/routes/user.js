const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const functionAuth = require('../middleware/functionAuth');

router.post('/register', UserController.RegisterUser);
router.post('/login', UserController.login);
router.post('/main', UserController.mainUser);
router.post('/update/:userID', UserController.updateUser);
router.post('/delete/:userID', UserController.deleteuse);
router.post('/editpass', UserController.changePasswordByuser);
router.post('/updateStatus', UserController.disableuser);
router.post('/checkduplicate', UserController.checkIfUserExists);
module.exports = router;
