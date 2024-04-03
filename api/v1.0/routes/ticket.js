const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const verifyParamsTicket = require('../middleware/verifyParamsTicket');

router.post('/create', TicketController.CreateTicket); // create a new Ticket
router.post('/main',TicketController.DatalistByTicket); // main list Ticket
router.post('/company-ticket',TicketController.CompanyTicket); // data company Ticket
router.post('/view',TicketController.ViewByTicket); // view data Ticket
router.post('/listdetail',TicketController.listdetailByTicket); // list detail Ticket
router.post('/list-edit',TicketController.listeditlByTicket); // list edit Ticket
router.post('/contact-company',TicketController.ContactCompany); // data contact Ticket
router.post('/assign-user', TicketController.AssignTeamUsers); // assign to user Ticket
router.post('/check-notification', TicketController.CheckNotificationTicket); // check notification Ticket
router.post('/list-edit-team', TicketController.listeditTeamByTicket); // list edit data Team Ticket
router.post('/count', TicketController.CountByTicket); // count data Ticket ID
router.post('/delete', verifyParamsTicket.DeleteTicket,TicketController.deleteByTicket); // delete data Ticket ID
router.post('/Update', TicketController.updateByTicket); // update data Ticket
router.post('/add-note', TicketController.AddNoteByTicket); // add Note Ticket
module.exports = router;