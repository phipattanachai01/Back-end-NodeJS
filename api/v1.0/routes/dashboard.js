const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

const functionAuth = require('../middleware/functionAuth');
router.post('/MainDashboard', functionAuth.verityMidToken, DashboardController.DashboardUser);

module.exports = router;
