const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/IssueController');

router.post('/add',IssueController.AddIssue);

module.exports = router;