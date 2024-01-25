const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

router.get('/DashboardUser', DashboardController.DashboardUser);

module.exports = router;
