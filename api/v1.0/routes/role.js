const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');

router.post('/add', RoleController.RoleUser);
router.post('/main',RoleController.ListRoles);
router.post('/edit', RoleController.EditRoles);
router.post('/delete', RoleController.DeleteRoles);
router.post('/roleuser',RoleController.RoleUsers);

module.exports = router;