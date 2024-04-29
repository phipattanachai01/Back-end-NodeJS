const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const functionAuth = require('../middleware/functionAuth');
const verifyParamsRole = require('../middleware/verifyParamsRole');

router.post('/add',functionAuth.verityMidToken, verifyParamsRole.role, RoleController.RoleUser);
router.post('/main',functionAuth.verityMidToken,RoleController.ListRoles);
router.post('/edit',functionAuth.verityMidToken, verifyParamsRole.Editrole, RoleController.EditRoles);
router.post('/delete',functionAuth.verityMidToken, RoleController.DeleteRoles);
router.post('/roleuser',functionAuth.verityMidToken,RoleController.RoleUsers);
router.post('/data-role',functionAuth.verityMidToken, RoleController.dataRole);
router.post('/update-status',functionAuth.verityMidToken, RoleController.updateStatusRole);
router.post('/data-edit',functionAuth.verityMidToken, RoleController.dataEditRole);

module.exports = router;