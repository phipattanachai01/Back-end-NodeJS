const express = require('express');
const router = express.Router();

const NotifyController = require('../controllers/NotifyController');

router.post('/main', NotifyController.MainNotify);


module.exports = router;