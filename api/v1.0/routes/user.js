const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const functionAuth = require('../middleware/functionAuth');

router.post('/register',functionAuth.verityMidToken, UserController.RegisterUser);
router.post('/login', UserController.login);
router.post('/main',functionAuth.verityMidToken, UserController.mainUser);
router.post('/update',functionAuth.verityMidToken, UserController.updateUser);
router.post('/delete',functionAuth.verityMidToken, UserController.deleteuse);
router.post('/editpass',functionAuth.verityMidToken, UserController.changePasswordByuser);
router.post('/update-status',functionAuth.verityMidToken, UserController.disableuser);
router.post('/checkduplicate',functionAuth.verityMidToken, UserController.checkUsername);
router.post('/data-edit',functionAuth.verityMidToken, UserController.dataEdit);
router.post('/list-role',functionAuth.verityMidToken, UserController.listroleUser);

module.exports = router;
