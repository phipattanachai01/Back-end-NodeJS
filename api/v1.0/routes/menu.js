const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const verifyparamslog = require('../middleware/verifyparamslog');
const functionAuth = require('../middleware/functionAuth');

router.post('/main', functionAuth.verityMidToken, MenuController.ListMenu);
// router.post('/update', verifyparamslog.insertlog, MenuController.UpdateMenu);
router.post('/update',functionAuth.verityMidToken, MenuController.UpdateMenu);
router.post('/sidemenu', functionAuth.verityMidToken, MenuController.SideMenu);

module.exports = router;
