const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');

router.post('/add', RoleController.RoleUser);

module.exports = router;