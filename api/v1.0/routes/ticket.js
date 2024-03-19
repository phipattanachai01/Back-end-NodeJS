const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

router.post('/create', TicketController.CreateTicket);
router.post('/main',TicketController.DatalistByTicket);
router.post('/company-ticket',TicketController.CompanyTicket);
router.post('/contact-company',TicketController.ContactCompany);
router.post('/assign-user', TicketController.AssignTeamUsers);
router.post('/check-notification', TicketController.CheckNotificationTicket);
module.exports = router;