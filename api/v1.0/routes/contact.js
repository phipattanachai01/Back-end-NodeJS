const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

router.post('/create', ContactController.CreateContact);
router.post('/main', ContactController.MainContact);
router.post('/edit', ContactController.EditContact);
router.post('/delete', ContactController.DeleteContact);
router.post('/check-email', ContactController.checkEmail);

module.exports = router;