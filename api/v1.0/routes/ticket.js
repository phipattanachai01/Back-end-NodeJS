const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

router.post('/create', TicketController.CreateTicket);
router.post('/company-ticket',TicketController.CompanyTicket);
router.post('/contact-company',TicketController.ContactCompany);
router.post('/assign-user', TicketController.AssignTeamUsers);
module.exports = router;