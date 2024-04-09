const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const verifyParamsTicket = require('../middleware/verifyParamsTicket');
const functionAuth = require('../middleware/functionAuth');
router.post('/create',functionAuth.verityMidToken, TicketController.CreateTicket); // create a new Ticket
router.post('/main',functionAuth.verityMidToken,TicketController.DatalistByTicket); // main list Ticket
router.post('/company-ticket',TicketController.CompanyTicket); // data company Ticket
router.post('/view',functionAuth.verityMidToken ,TicketController.ViewByTicket); // view data Ticket
router.post('/listdetail',functionAuth.verityMidToken,TicketController.listdetailByTicket); // list detail Ticket
router.post('/list-edit',TicketController.listeditlByTicket); // list edit Ticket
router.post('/contact-company',TicketController.ContactCompany); // data contact Ticket
router.post('/assign-user', TicketController.AssignTeamUsers); // assign to user Ticket
router.post('/check-notification', TicketController.CheckNotificationTicket); // check notification Ticket
router.post('/list-edit-team', TicketController.listeditTeamByTicket); // list edit data Team Ticket
router.post('/count', TicketController.CountByTicket); // count data Ticket ID
router.post('/delete', verifyParamsTicket.DeleteTicket,TicketController.deleteByTicket); // delete data Ticket ID
router.post('/update', TicketController.updateByTicket); // update data Ticket
router.post('/add-note',functionAuth.verityMidToken,TicketController.AddNoteByTicket); // add Note Ticket
router.post('/finddate',TicketController.Finddate); // find date
router.post('/tags',TicketController.Tags); // list tag Ticket
router.post('/edit-note',TicketController.EditNoteByTicket); // edit note Ticket
router.post('/delete-note',TicketController.DeleteNoteByTicket); // delete note Ticket
// router.post('/mainnote', functionAuth.verityMidToken,TicketController.MainNoteByTicket); // Test main note
module.exports = router;