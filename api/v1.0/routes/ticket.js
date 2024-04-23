const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const verifyParamsTicket = require('../middleware/verifyParamsTicket');
const functionAuth = require('../middleware/functionAuth');
router.post('/create',functionAuth.verityMidToken,TicketController.CreateTicket); // create a new Ticket
router.post('/main',functionAuth.verityMidToken,TicketController.DatalistByTicket); // main list Ticket
router.post('/company-ticket', functionAuth.verityMidToken,TicketController.CompanyTicket); // data company Ticket
router.post('/view',functionAuth.verityMidToken ,TicketController.ViewByTicket); // view data Ticket
router.post('/listdetail',functionAuth.verityMidToken,TicketController.listdetailByTicket); // list detail Ticket
router.post('/list-edit', functionAuth.verityMidToken,TicketController.listeditlByTicket); // list edit Ticket
router.post('/contact-company', functionAuth.verityMidToken,TicketController.ContactCompany); // data contact Ticket
router.post('/assign-user', functionAuth.verityMidToken, TicketController.AssignTeamUsers); // assign to user Ticket
router.post('/check-notification', functionAuth.verityMidToken, TicketController.CheckNotificationTicket); // check notification Ticket
router.post('/list-edit-team', functionAuth.verityMidToken, TicketController.listeditTeamByTicket); // list edit data Team Ticket
router.post('/count', functionAuth.verityMidToken, TicketController.CountByTicket); // count data Ticket ID
router.post('/delete', functionAuth.verityMidToken, functionAuth.verityMidToken, verifyParamsTicket.DeleteTicket,TicketController.deleteByTicket); // delete data Ticket ID
router.post('/update', functionAuth.verityMidToken, TicketController.updateByTicket); // update data Ticket
router.post('/add-note', functionAuth.verityMidToken,functionAuth.verityMidToken,TicketController.AddNoteByTicket); // add Note Ticket
router.post('/finddate', functionAuth.verityMidToken,TicketController.Finddate); // find date
router.post('/tags', functionAuth.verityMidToken, functionAuth.verityMidToken,TicketController.Tags); // list tag Ticket
router.post('/edit-note', functionAuth.verityMidToken,TicketController.EditNoteByTicket); // edit note Ticket
router.post('/delete-note', functionAuth.verityMidToken,TicketController.DeleteNoteByTicket); // delete note Ticket
router.post('/listfile', functionAuth.verityMidToken,verifyParamsTicket.listFile,TicketController.MainFile);
router.post('/detail-file', functionAuth.verityMidToken,TicketController.detailFiles); // detail file Ticket
// router.post('/mainnote', functionAuth.verityMidToken,TicketController.MainNoteByTicket); // Test main note
module.exports = router;