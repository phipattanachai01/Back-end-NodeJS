const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');

router.post('/create', TagController.CreateByTag);
router.post('/delete', TagController.DeleteByTag);

module.exports = router;