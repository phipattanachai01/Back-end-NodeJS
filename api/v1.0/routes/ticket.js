const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');


router.post('/create', TicketController.CreateTicket);
router.post('/main',TicketController.DatalistByTicket);
router.post('/company-ticket',TicketController.CompanyTicket);
router.post('/listdetail',TicketController.listdetailByTicket);
router.post('/list-edit',TicketController.listeditlByTicket);
router.post('/contact-company',TicketController.ContactCompany);
router.post('/assign-user', TicketController.AssignTeamUsers);
router.post('/check-notification', TicketController.CheckNotificationTicket);
router.post('/list-edit-team', TicketController.listeditTeamByTicket);
module.exports = router;