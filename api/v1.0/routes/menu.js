const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const verifyparamslog = require('../middleware/verifyparamslog');
router.post('/main', MenuController.ListMenu);
// router.post('/update', verifyparamslog.insertlog, MenuController.UpdateMenu);
router.post('/update',MenuController.UpdateMenu);

module.exports = router;
