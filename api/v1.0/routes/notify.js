const express = require('express');
const router = express.Router();
const NotifyController = require('../controllers/NotifyController');
const functionAuth = require('../middleware/functionAuth');

router.post('/main',functionAuth.verityMidToken, NotifyController.MainNotify);
router.post('/listnoti',functionAuth.verityMidToken, NotifyController.listNotification);

module.exports = router;