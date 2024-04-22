const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const functionAuth = require('../middleware/functionAuth');

router.post('/add',functionAuth.verityMidToken, RoleController.RoleUser);
router.post('/main',functionAuth.verityMidToken,RoleController.ListRoles);
router.post('/edit',functionAuth.verityMidToken, RoleController.EditRoles);
router.post('/delete',functionAuth.verityMidToken, RoleController.DeleteRoles);
router.post('/roleuser',functionAuth.verityMidToken,RoleController.RoleUsers);
router.post('/data-role',functionAuth.verityMidToken, RoleController.dataRole);

module.exports = router;