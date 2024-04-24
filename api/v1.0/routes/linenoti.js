const express = require('express');
const router = express.Router();
const Linenotion = require('../controllers/LineNotiController');

router.post('/line', Linenotion.TokenLineNoti)

module.exports = router;