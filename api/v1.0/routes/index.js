const express = require('express');
const router = express.Router();
const Proflie = require('./proflie');
const dashboard = require('./dashboard');
const user = require('./user');
const ticket = require('./ticket');
const setting = require('./setting');
const notify = require('./notify');
const company = require('./company');

router.use('/profile', Proflie);
router.use('/dashboard',dashboard);
router.use('/user', user);
router.use('/ticket',ticket);
router.use('/setting',setting);
router.use('/notify',notify);
router.use('/company',company);


// dashboard / incomeExpenses;

// router
module.exports = router;
