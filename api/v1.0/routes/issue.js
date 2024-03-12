const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/IssueController');

router.post('/main', IssueController.MainIssue);
router.post('/add',IssueController.AddIssue);
router.post('/update/:IssueId',IssueController.UpdateIssue);
router.post('/delete/:IssueId',IssueController.DeleteIssue);
router.post('/priority',IssueController.ListPriority);
router.post('/types-date',IssueController.ListTypesDate);

module.exports = router;