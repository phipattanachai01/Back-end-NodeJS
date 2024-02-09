const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');

router.post('/add', RoleController.RoleUser);
router.post('/main',RoleController.ListRoles);
router.post('/edit/:RoleId', RoleController.EditRoles);
router.post('/delete/:RoleId', RoleController.DeleteRoles);

module.exports = router;