const express = require('express');
const router = express.Router();

const NotifyController = require('../controllers/NotifyController');

router.post('/main', NotifyController.MainNotify);
router.post('/listnoti',NotifyController.listNotification);

module.exports = router;