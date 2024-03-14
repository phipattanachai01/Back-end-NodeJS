const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

router.post('/create', TicketController.CreateTicket);
router.post('/company-ticket',TicketController.CompanyTicket);
module.exports = router;