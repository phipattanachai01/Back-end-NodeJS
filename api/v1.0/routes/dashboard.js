const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

router.post('/MainDashboard', DashboardController.DashboardUser);

module.exports = router;
