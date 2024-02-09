const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
router.post('/main',MenuController.ListMenu);
router.post('/update',MenuController.UpdateMenu);

module.exports = router;