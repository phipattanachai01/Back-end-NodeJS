const express = require('express');
const router = express.Router();
const Proflie = require('./proflie');
const dashboard = require('./dashboard');
const user = require('./user');
const ticket = require('./ticket');
// const setting = require('./setting');
const notify = require('./notify');
const company = require('./company');
const team = require('./team');
const contact = require('./contact');
const role = require('./role');
const menu = require('./menu');
const issue = require('./issue');
const tag = require('./tag');

router.use('/profile', Proflie);
router.use('/dashboard', dashboard);
router.use('/user', user);
router.use('/ticket', ticket);
// router.use('/setting', setting);
router.use('/notify', notify);
router.use('/company', company);
router.use('/team', team);
router.use('/contact', contact);
router.use('/role', role);
router.use('/menu', menu);
router.use('/issue', issue);
router.use('/tag', tag);


// dashboard / incomeExpenses;

// router
module.exports = router;
