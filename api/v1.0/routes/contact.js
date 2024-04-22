const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');
const functionAuth = require('../middleware/functionAuth');

router.post('/create',functionAuth.verityMidToken , ContactController.CreateContact);
router.post('/main',functionAuth.verityMidToken , ContactController.MainContact);
router.post('/edit',functionAuth.verityMidToken , ContactController.EditContact);
router.post('/delete',functionAuth.verityMidToken , ContactController.DeleteContact);
router.post('/check-email',functionAuth.verityMidToken , ContactController.checkEmail);
router.post('/data-edit',functionAuth.verityMidToken , ContactController.dataEditContact);

module.exports = router;