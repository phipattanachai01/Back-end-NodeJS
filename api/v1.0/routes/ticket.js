const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

router.post('/create', TicketController.CreateTicket);
module.exports = router;